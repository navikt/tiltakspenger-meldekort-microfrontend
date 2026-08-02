import type { Logger } from "pino";

let logger: Logger;

/**
 * Kun server-side; pino lastes bak SSR-gaten, så klientbundelen slipper pinos browser-build.
 * I klientbundelen er `logger` dermed undefined. Klientscriptet i index.astro importerer den,
 * men har i dag ingen nåbar bruk (klikklytteren festes aldri) - hele det scriptet ryddes
 * sammen med analytics-oppsettet.
 * All OTel-instrumentering (traces, logger, pino-korrelasjon) eies av nais-operatøren, som
 * injiserer sin SDK via NODE_OPTIONS før appkoden kjører. En egen NodeSDK her avvises som
 * duplikat av @opentelemetry/api, og en egen SIGTERM-handler ville revet prosessen mens
 * operatørens SDK flusher siste batch spans og logger. Derfor settes kun pino opp her.
 */
if (import.meta.env.SSR) {
    const { default: pino } = await import("pino");

    logger = pino({
        timestamp: () => `,"@timestamp":"${new Date().toISOString()}"`,
        formatters: {
            level: (label) => ({ level: label.toUpperCase() }),
        },
    });
}

export { logger };
