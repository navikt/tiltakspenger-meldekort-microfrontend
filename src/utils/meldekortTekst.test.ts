import { describe, expect, it } from "vitest";
import { getMeldekortText } from "./meldekortTekst";
import type { Language } from "../language/types";

const SPRAAK: Language[] = ["nb", "nn", "en"];

describe("getMeldekortText", () => {
    it("viser neste innsendingstidspunkt når ingenting er klart til innsending", () => {
        const tekst = getMeldekortText(
            {
                antallMeldekortKlarTilInnsending: 0,
                // 23:00 UTC er 16. juni i Oslo, men fortsatt 15. juni i UTC - tidspunktet
                // krysser midnatt, så testen feiler i CI (UTC) om noen fjerner timeZone.
                nesteMuligeInnsendingstidspunkt: "2024-06-15T23:00:00Z",
            },
            "nb",
        );

        expect(tekst).toContain("16. juni 2024");
        expect(tekst).not.toContain("{dato}");
    });

    it("faller tilbake til enkeltmeldekort-teksten når neste tidspunkt mangler", () => {
        const tekst = getMeldekortText(
            { antallMeldekortKlarTilInnsending: 0, nesteMuligeInnsendingstidspunkt: null },
            "nb",
        );

        expect(tekst).toBe("Send inn meldekort");
    });

    it("bruker entallsteksten når ett meldekort er klart", () => {
        const tekst = getMeldekortText(
            {
                antallMeldekortKlarTilInnsending: 1,
                nesteMuligeInnsendingstidspunkt: "2024-06-16T00:00:00Z",
            },
            "nb",
        );

        expect(tekst).toBe("Send inn meldekort");
    });

    it("setter inn antallet når flere meldekort er klare", () => {
        const tekst = getMeldekortText(
            { antallMeldekortKlarTilInnsending: 3, nesteMuligeInnsendingstidspunkt: null },
            "nb",
        );

        expect(tekst).toBe("Du har 3 meldekort klare til innsending");
        expect(tekst).not.toContain("{count}");
    });

    it.each(SPRAAK)("etterlater ingen plassholdere på %s", (language) => {
        const alleTilstander = [
            {
                antallMeldekortKlarTilInnsending: 0,
                nesteMuligeInnsendingstidspunkt: "2024-06-16T00:00:00Z",
            },
            { antallMeldekortKlarTilInnsending: 0, nesteMuligeInnsendingstidspunkt: null },
            { antallMeldekortKlarTilInnsending: 1, nesteMuligeInnsendingstidspunkt: null },
            { antallMeldekortKlarTilInnsending: 5, nesteMuligeInnsendingstidspunkt: null },
        ];

        for (const tilstand of alleTilstander) {
            const tekst = getMeldekortText(tilstand, language);
            expect(tekst).not.toMatch(/\{(dato|count)\}/);
            expect(tekst.length).toBeGreaterThan(0);
        }
    });

    it("formaterer datoen på engelsk når språket er en", () => {
        const tekst = getMeldekortText(
            {
                antallMeldekortKlarTilInnsending: 0,
                nesteMuligeInnsendingstidspunkt: "2024-06-16T00:00:00Z",
            },
            "en",
        );

        expect(tekst).toContain("June");
    });
});
