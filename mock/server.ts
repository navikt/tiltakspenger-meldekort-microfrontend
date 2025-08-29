import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";
import mockData from "./data/meldekort-kort-info.json";

const api = new Hono();

// Enable CORS for all routes
api.use(
    "/*",
    cors({
        origin: "http://localhost:4321",
        credentials: true,
    }),
);

api.get("/din-side/microfrontend/meldekort-kort-info", (c) => {
    return c.json(mockData);
});

serve({
    fetch: api.fetch,
    port: 8083,
});
