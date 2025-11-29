import type { LoginInput, RegisterInput } from "./schema";

const resolveApiUrl = (path: string) => {
    const base = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
    return new URL(path, base).toString();
};

const jsonHeaders = {
    "Content-Type": "application/json"
} as const;

const removeUndefined = <T extends Record<string, unknown>>(object: T) =>
    Object.fromEntries(
        Object.entries(object).filter(([, value]) => value !== undefined && value !== null)
    ) as T;

class ApiError extends Error {
    constructor(
        message: string,
        public status: number,
        public readonly code?: string
    ) {
        super(message);
        this.name = "ApiError";
    }
}

export type AuthUser = {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
    emailVerified?: string | null;
    [key: string]: unknown;
};

export type AuthSession = {
    id?: string;
    userId: string;
    expiresAt?: string;
    token?: string | null;
    [key: string]: unknown;
};

export type SessionResponse = {
    session: AuthSession | null;
    user: AuthUser | null;
};

const parseJson = async <T>(response: Response): Promise<T> => {
    const text = await response.text();
    if (!text) return {} as T;
    try {
        return JSON.parse(text) as T;
    } catch (error) {
        throw new ApiError("Invalid server response", response.status);
    }
};

const request = async <T>(path: string, init: RequestInit = {}): Promise<T> => {
    const response = await fetch(resolveApiUrl(path), {
        ...init,
        headers: {
            ...jsonHeaders,
            ...(init.headers ?? {})
        },
        credentials: "include"
    });

    if (!response.ok) {
        const payload = await parseJson<{ error?: string; code?: string }>(response);
        throw new ApiError(payload.error ?? response.statusText, response.status, payload.code);
    }

    if (response.status === 204) {
        return {} as T;
    }

    return parseJson<T>(response);
};

export const login = async (payload: LoginInput) =>
    request<{
        redirect?: boolean;
        redirectTo?: string | null;
        sessionToken?: string | null;
        user: AuthUser;
    }>("/auth/login", {
        method: "POST",
        body: JSON.stringify(removeUndefined(payload))
    });

export const register = async (payload: RegisterInput) =>
    request<{
        user: AuthUser;
        sessionToken?: string | null;
    }>("/auth/register", {
        method: "POST",
        body: JSON.stringify(removeUndefined(payload))
    });

export const logout = async () =>
    request<{ success?: boolean; message?: string }>("/auth/logout", {
        method: "POST"
    });

export const getSession = async () => request<SessionResponse>("/auth/session", { method: "GET" });

export const getProfile = async () =>
    request<{ user: AuthUser }>("/auth/profile", { method: "GET" });

export { ApiError };
