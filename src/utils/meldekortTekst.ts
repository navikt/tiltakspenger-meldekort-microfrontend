import { text } from "../language/text";
import type { Language } from "../language/types";
import type { MeldekortKortInfo } from "../types/MeldekortType";

/**
 * Formaterer tidspunktet for neste mulige innsending.
 * Intl brukes framfor et datobibliotek fordi språkene våre (nb/nn/en) er de samme
 * Intl allerede kjenner - se README om avvik fra meldekort-mikrofrontend, som bruker dayjs.
 */
export const formaterInnsendingstidspunkt = (isoDato: string, language: Language) =>
    new Intl.DateTimeFormat(language, {
        // API-et sender UTC. Uten eksplisitt sone følger formateringen containerens TZ,
        // og rundt midnatt vises feil dag: 2026-02-15T23:00Z blir «15. februar» i UTC,
        // men er «16. februar» i Norge.
        timeZone: "Europe/Oslo",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
    }).format(new Date(isoDato));

/** Teksten på meldekortkortet, avhengig av hvor mange meldekort som er klare. */
export const getMeldekortText = (data: MeldekortKortInfo, language: Language): string => {
    if (data.antallMeldekortKlarTilInnsending === 0 && data.nesteMuligeInnsendingstidspunkt) {
        return text.neste[language].replace(
            "{dato}",
            formaterInnsendingstidspunkt(data.nesteMuligeInnsendingstidspunkt, language),
        );
    }

    if (data.antallMeldekortKlarTilInnsending > 1) {
        return text.flere[language].replace(
            "{count}",
            data.antallMeldekortKlarTilInnsending.toString(),
        );
    }

    return text.ett[language];
};
