import { createApp } from "./src/app";
import { env } from "./src/config/env";

const app = createApp();

const server = Bun.serve({
    port: env.PORT,
    fetch: app.fetch
});

console.log(`Server listening on ${env.APP_URL} (port ${server.port})`);
