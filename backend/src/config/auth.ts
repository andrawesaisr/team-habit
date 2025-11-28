import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import type { BetterAuthOptions } from "better-auth";
import { env } from "./env";
import { db } from "../lib/db/client";
import * as schema from "../lib/db/schema";

const authOptions: BetterAuthOptions = {
    basePath: "/auth",
    baseURL: env.APP_URL,
    secret: env.AUTH_SECRET,
    trustedOrigins: [env.APP_URL],
    emailAndPassword: {
        enabled: true,
        minPasswordLength: 8,
        requireEmailVerification: false
        },
    session: {
        cookieCache: {
            enabled: true,
            strategy: "jwe",
            refreshCache: true
        }
    },
    logger: {
        level: env.NODE_ENV === "production" ? "error" : "debug"
    },
    database: drizzleAdapter(db, {
        schema,
        provider: "pg"
    })
};

export const auth = betterAuth(authOptions);
