import type { Logger } from "pino";

let logger: Logger;

/**
 * pino lastes bak SSR-gaten, så klientbundelen slipper pinos browser-build; i nettleseren
 * er konsollen sluket, slik at en klientimport aldri møter en undefined logger.
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
} else {
    // Konsollens error/warn/info/debug dekker måtene logger faktisk brukes på.
    logger = console as unknown as Logger;
}

export { logger };
