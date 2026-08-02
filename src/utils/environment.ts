import type { APIContext } from "astro";

/**
 * Prober og andre interne ruter skal forbi TokenX-valideringen.
 * Match kun på stien: `includes("/internal")` traff hele URL-en inkludert query-strengen,
 * så `/nb/fallback?x=/internal` slapp gjennom auth-gaten og ble servert uten token.
 * Mønsteret er arvet fra tms-microfrontend-template-ssr og gjelder flere av mikrofrontendene.
 */
export const isInternal = (context: APIContext) =>
    new URL(context.request.url).pathname.startsWith("/api/internal");

export const isLocal = process.env.NODE_ENV === "development";
