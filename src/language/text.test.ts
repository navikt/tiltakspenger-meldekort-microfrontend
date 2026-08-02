import { describe, expect, it } from "vitest";
import { text } from "./text";
import type { Language } from "./types";

const SPRAAK: Language[] = ["nb", "nn", "en"];

describe("text", () => {
    it.each(Object.keys(text))("har alle tre språk for %s", (noekkel) => {
        const oversettelser = text[noekkel as keyof typeof text];

        for (const language of SPRAAK) {
            expect(oversettelser[language], `${noekkel}.${language} mangler`).toBeTruthy();
        }
    });

    it("beholder plassholderne i tekstene som får innsatt verdi", () => {
        for (const language of SPRAAK) {
            expect(text.neste[language]).toContain("{dato}");
            expect(text.flere[language]).toContain("{count}");
        }
    });
});
