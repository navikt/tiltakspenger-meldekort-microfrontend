import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

// Kommentarer strippes først. Uten det leser reglene under kommentarer som beskriver
// gammel eller feilaktig CSS - de skal dokumentere fallgruver uten å utløse dem.
const css = readFileSync(new URL("./index.module.css", import.meta.url), "utf8").replace(
    /\/\*[\s\S]*?\*\//g,
    "",
);

const boxShadowVerdier = () =>
    [...css.matchAll(/box-shadow\s*:\s*([^;]+);/g)].map((treff) =>
        treff[1].replace(/\s+/g, " ").trim(),
    );

/**
 * En bar farge er ikke en gyldig box-shadow. Fordi verdien kommer via var(), regnes den
 * som «invalid at computed-value time», og da nullstilles egenskapen til initialverdien
 * (none) i stedet for at deklarasjonen ignoreres - skyggen forsvinner altså helt.
 * Det var nøyaktig feilen i :hover og :focus: box-shadow: var(--ax-border-neutral-subtleA).
 */
const erGyldigSkygge = (verdi: string) =>
    verdi === "none" ||
    /^(inset\s+)?-?[0-9]/.test(verdi) || // starter med en lengde
    /^var\(--ax-shadow-[a-z0-9-]+\)$/.test(verdi); // ren skygge-token

describe("index.module.css", () => {
    it("har box-shadow-deklarasjoner å sjekke", () => {
        expect(boxShadowVerdier().length).toBeGreaterThan(0);
    });

    it.each(boxShadowVerdier())("box-shadow «%s» er en gyldig skyggeverdi", (verdi) => {
        expect(
            erGyldigSkygge(verdi),
            `«${verdi}» er ikke en gyldig box-shadow. Bruk lengder foran fargetokenet, ` +
                `f.eks. «0 0 0 3px var(--ax-border-brand-blue-strong)», eller en --ax-shadow-token.`,
        ).toBe(true);
    });

    it("fjerner aldri fokusmarkering uten å sette en ny", () => {
        // outline: none er kun forsvarlig når noe annet markerer fokus.
        const fjernerOutline = /outline\s*:\s*(none|0)\b/.test(css);
        const harFokusMarkering = /:focus(-within|-visible)?\s*\{[^}]*box-shadow/.test(css);

        expect(
            !fjernerOutline || harFokusMarkering,
            "outline: none uten en box-shadow-basert fokusring gjør kortet utilgjengelig med tastatur",
        ).toBe(true);
    });

    it("klipper ikke bort fokusringen (WCAG 2.4.7)", () => {
        // <a>-en fyller hele kortet, så nettleserens fokusring tegnes utenfor lenka og
        // klippes bort av overflow: hidden. Da må ringen enten flyttes innenfor med negativ
        // outline-offset, eller tegnes på kortet selv med :focus-within.
        const klipper = /\.microfrontend\s*\{[^}]*overflow\s*:\s*hidden/.test(css);
        const ringInnenfor = /:focus(-visible)?\s*\{[^}]*outline-offset\s*:\s*-/.test(css);
        const ringPaaKortet = /:focus-within\s*\{[^}]*box-shadow/.test(css);

        expect(
            !klipper || ringInnenfor || ringPaaKortet,
            "overflow: hidden klipper bort fokusringen. Bruk negativ outline-offset på lenka " +
                "eller en box-shadow på :focus-within.",
        ).toBe(true);
    });
});
