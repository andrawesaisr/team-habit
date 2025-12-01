import type { Hono } from "hono";
import { authRouter } from "./auth";
import { workspaceRouter } from "./workspace";

export const registerRoutes = (app: Hono) => {
    app.route("/auth", authRouter);
    app.route("/workspaces", workspaceRouter);
};
