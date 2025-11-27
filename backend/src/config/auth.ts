import { betterAuth } from "better-auth";
import type { BetterAuthOptions } from "better-auth";
import { env } from "./env";

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
    }
};

export const auth = betterAuth(authOptions);
