import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import {
    loginHandler,
    logoutHandler,
    profileHandler,
    registerHandler,
    sessionHandler
} from "./controller";
import { loginSchema, registerSchema } from "./schema";

export const authRouter = new Hono();

authRouter.post("/register", zValidator("json", registerSchema), registerHandler);
authRouter.post("/login", zValidator("json", loginSchema), loginHandler);
authRouter.post("/logout", logoutHandler);
authRouter.get("/session", sessionHandler);
authRouter.get("/profile", profileHandler);
