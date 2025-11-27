import { Hono } from "hono";
import { registerRoutes } from "./routes";

export const createApp = () => {
    const app = new Hono();

    app.get("/", (c) => c.json({ status: "ok" }));

    registerRoutes(app);

    return app;
};
