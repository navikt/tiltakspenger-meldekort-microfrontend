import pino from "pino";

let logger: ReturnType<typeof pino>;

/** Merk: Dette er kun server-side kode.
 * @opentelemetry/sdk-node bruker Node-spesifikke moduler som 'zlib' og 'stream', som ikke finnes
 * i nettleseren.
 * Derfor må importen kun skje under SSR (import.meta.env.SSR) så Astro/Vite ynngår å pakke
 * nodemodulene inn i klienten.
 */
if (import.meta.env.SSR) {
    const { logs, NodeSDK, tracing } = await import("@opentelemetry/sdk-node");

    const sdk = new NodeSDK({
        spanProcessors: [new tracing.SimpleSpanProcessor(new tracing.ConsoleSpanExporter())],
        logRecordProcessors: [
            // Fra @opentelemetry/sdk-node 0.221 tar SimpleLogRecordProcessor et options-objekt.
            new logs.SimpleLogRecordProcessor({ exporter: new logs.ConsoleLogRecordExporter() }),
        ],
    });

    sdk.start();

    process.on("SIGTERM", () => {
        sdk.shutdown()
            .then(() => logger.info("Opentelemetry Tracing terminated"))
            .catch((error) => logger.error("Error terminating Opentelemetry Tracing", error))
            .finally(() => process.exit(0));
    });

    logger = pino({
        timestamp: () => `,"@timestamp":"${new Date().toISOString()}"`,
        formatters: {
            level: (label) => ({ level: label.toUpperCase() }),
        },
    });
}

export { logger };
