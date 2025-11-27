import { APIError } from "better-call";
import type { Context } from "hono";
import { auth } from "../../config/auth";
import type { LoginPayload, RegisterPayload } from "./schema";

type Jsonish = Record<string, unknown>;

const propagateSetCookieHeaders = (c: Context, headers: Headers) => {
    headers.forEach((value, key) => {
        if (key.toLowerCase() !== "set-cookie") return;
        c.header("Set-Cookie", value, { append: true });
    });
};

const handleAuthError = (c: Context, error: unknown) => {
    if (error instanceof APIError) {
        const status = typeof error.statusCode === "number" ? error.statusCode : 500;
        const payload: Jsonish = {
            error: error.body?.message ?? "Authentication failed"
        };

        if (error.body?.code) payload.code = error.body.code;
        if (error.headers) propagateSetCookieHeaders(c, new Headers(error.headers));

        return c.json(payload, status as any);
    }

    console.error("[auth] unexpected error", error);
    return c.json({ error: "Internal server error" }, 500);
};

const authHeaders = (c: Context) => ({
    headers: c.req.raw.headers,
    request: c.req.raw
});

export const registerHandler = async (c: Context) => {
    const payload = await c.req.json() as RegisterPayload;

    try {
        const { response, headers } = await auth.api.signUpEmail({
            body: payload,
            ...authHeaders(c),
            returnHeaders: true
        });

        propagateSetCookieHeaders(c, headers);

        return c.json(
            {
                user: response.user,
                sessionToken: response.token
            },
            response.token ? 201 : 200
        );
    } catch (error) {
        return handleAuthError(c, error);
    }
};

export const loginHandler = async (c: Context) => {
    const payload = await c.req.json() as LoginPayload;

    try {
        const { response, headers } = await auth.api.signInEmail({
            body: payload,
            ...authHeaders(c),
            returnHeaders: true
        });

        propagateSetCookieHeaders(c, headers);

        return c.json({
            redirect: response.redirect,
            redirectTo: response.url,
            sessionToken: response.token,
            user: response.user
        });
    } catch (error) {
        return handleAuthError(c, error);
    }
};

export const logoutHandler = async (c: Context) => {
    try {
        const { response, headers } = await auth.api.signOut({
            ...authHeaders(c),
            returnHeaders: true
        });

        propagateSetCookieHeaders(c, headers);

        return c.json(response);
    } catch (error) {
        return handleAuthError(c, error);
    }
};

export const sessionHandler = async (c: Context) => {
    try {
        const { response, headers } = await auth.api.getSession({
            ...authHeaders(c),
            returnHeaders: true
        });

        if (headers) propagateSetCookieHeaders(c, headers);

        return c.json(
            response
                ? { session: response.session, user: response.user }
                : { session: null, user: null }
        );
    } catch (error) {
        return handleAuthError(c, error);
    }
};

export const profileHandler = async (c: Context) => {
    try {
        const { response, headers } = await auth.api.getSession({
            ...authHeaders(c),
            returnHeaders: true
        });

        if (headers) propagateSetCookieHeaders(c, headers);

        if (!response) {
            return c.json({ error: "Not authenticated" }, 401);
        }

        return c.json({ user: response.user });
    } catch (error) {
        return handleAuthError(c, error);
    }
};
