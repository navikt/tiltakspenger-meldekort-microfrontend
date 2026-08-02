/** Svaret fra tiltakspenger-meldekort-api sitt /din-side/microfrontend/meldekort-kort-info. */
export interface MeldekortKortInfo {
    antallMeldekortKlarTilInnsending: number;
    /** ISO-8601. Kun satt når det ikke finnes meldekort klare til innsending nå. */
    nesteMuligeInnsendingstidspunkt: string | null;
}
