import type { Hono } from "hono";
import { authRouter } from "./auth";

export const registerRoutes = (app: Hono) => {
    app.route("/auth", authRouter);
};
