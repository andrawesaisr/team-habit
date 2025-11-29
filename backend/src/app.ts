import { Hono } from "hono";
import { cors } from "hono/cors";
import { registerRoutes } from "./routes";

export const createApp = () => {
    const app = new Hono();

    // Enable CORS for frontend
    app.use("*", cors({
        origin: "http://localhost:5173",
        credentials: true,
        allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowHeaders: ["Content-Type", "Authorization"]
    }));

    app.get("/", (c) => c.json({ status: "ok" }));

    registerRoutes(app);

    return app;
};
