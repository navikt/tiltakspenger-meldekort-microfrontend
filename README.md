# tiltakspenger-meldekort-microfrontend

Mikrofrontend til "Min Side" for tiltakspenger meldekort.

# Kjøre appen lokalt

Repoet bruker [pnpm](https://pnpm.io/) (versjonen styres av `packageManager`-feltet i `package.json`, aktiver med `corepack enable pnpm`).

1. Installer dependencies: `pnpm install`
2. Start Hono mockserver: `pnpm run mock`
3. Med mockserver kjørende i egen terminal, start appen: `pnpm run dev`
4. Appen nås på http://localhost:4321/

Mockserveren dekker `MELDEKORT_API_URL`-defaulten i `astro.config.mjs`, så du trenger ingen `.env` lokalt.
Fra Astro 7 kjører `astro dev` i bakgrunnen: `Ctrl-C` stopper den ikke, bruk `pnpm exec astro dev stop`
(`astro dev status` og `astro dev logs` finnes også).

# Kvalitetsgater

`pnpm run lint && pnpm run test && pnpm run build` — samme rekkefølge som i CI.

- **lint** dekker også `.astro`-malene. Det er den eneste gaten som fanger ugyldig markup i malene;
  `astro check` typesjekker og godtar f.eks. en forvillet `}` som blir til et meningsløst attributt.
- **test** (vitest) dekker tekstlogikken og to stilregler: `box-shadow` settes aldri til en bar
  fargetoken (ugyldig via `var()`, og nullstiller skyggen i stedet for å bli ignorert), og
  fokusringen klippes ikke bort av `overflow: hidden`.
- **build** er `astro check && astro build`.

## Tilgjengelighet

Kortet er én stor lenke, og fokusmarkeringen er det som lettest ryker.

`<a>`-en fyller hele kortet, og kortet har `overflow: hidden`. Nettleserens fokusring tegnes
utenfor lenka og ble derfor klippet helt bort — med tastatur hadde kortet ingen synlig
fokusmarkering (WCAG 2.4.7). `outline-offset: -2px` flytter ringen innenfor klippeflaten.

Vi bruker nettleserens `outline` framfor en `box-shadow`-ring med vilje: `outline` overlever
tvungne farger (High Contrast), følger brukerens egne innstillinger og trenger ingen farge fra oss.
Måltall i dagens oppsett: tekstkontrast 15:1 (krav 4.5:1), fokusring 5,98:1 mot kortet (krav 3:1),
og hele kortet er klikkflate. Chevronen er `aria-hidden`, så lenkas navn er tittel + brødtekst.

Ikke sett `outline: none` uten å sette noe annet i stedet — testen stopper det.

# Forholdet til meldekort-mikrofrontend

Nav har to meldekort-mikrofrontender på Min side: denne for tiltakspenger, og
[navikt/meldekort-mikrofrontend](https://github.com/navikt/meldekort-mikrofrontend) for dagpenger og AAP.
De skal ligge så tett som mulig — avvik skal være bevisste, og de som finnes er begrunnet under.

Holdes likt: Astro-versjoner (`astro`, `@astrojs/node`, `@astrojs/react`), katalogstrukturen under `src/`,
i18n-oppsettet (`nb`/`nn`/`en` med `prefixDefaultLocale: true`), SSR med node-adapteren i `standalone`,
TokenX-validering i middleware og prober på `/api/internal/*`.

| Tema | Denne appen | meldekort-mikrofrontend | Hvorfor vi avviker |
| --- | --- | --- | --- |
| Domenemodell | Ett antall og ett tidspunkt | Ordinære og etterregistrerte meldekort, egne pending/ready-tilstander | Tiltakspenger er en vesentlig mindre ytelse enn dagpenger og AAP. Kortet vårt har én tilstand å vise, ikke fire. |
| Datoformat | `Intl.DateTimeFormat` | `dayjs` | Språkene våre er de `Intl` allerede kan. Vi slipper en avhengighet i produksjonsbundelen. |
| Komponentsplitt | Ett kort i `[locale]/index.astro` | `LinkCard` + tre tilstandskomponenter | Følger av domenemodellen over. Splittes når vi får flere tilstander. |
| Lint og formatering | eslint + prettier | biome | Tiltakspenger-flåten deler workflows og eslint-oppsett fra metarepoet. Å bytte her ville løsrevet oss fra de andre repoene våre. |
| Tester | vitest | ingen | Vi la til tester etter en malfeil og en stilfeil som ingen gate fanget. Dette er et avvik søsterappen bør ta etter, ikke motsatt. |
| Hover-effekt | Kun chevron og understreking | Hever skyggen | Kortet brukes mest på mobil og nettbrett, der hover ikke finnes. Vi endrer ikke hviletilstanden — den alle faktisk ser — for en effekt bare desktop får. |
| `redirectToDefaultLocale` | `true`, satt eksplisitt | ikke satt | Astro 6 snudde defaulten fra `true` til `false`. Vi setter den for å beholde at `/` går til `/nb/`. Søsterappen ser ut til å ha tatt den nye defaulten uten å ta stilling til den — det samme gjelder `k9-innsyn-dine-pleiepenger` og `ungdomsprogramytelse-innsyn`. Verten `tms-min-side` og malen `tms-microfrontend-template-ssr` setter den eksplisitt, slik vi gjør. |

# Henvendelser

Spørsmål knyttet til koden eller prosjektet kan stilles som issues her på github.

## For NAV-ansatte

Interne henvendelser kan sendes via Slack i kanalen [#tiltakspenger-værsågod](https://nav-it.slack.com/archives/C03FVKDFTQV).
