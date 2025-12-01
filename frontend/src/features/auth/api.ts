import type { LoginInput, RegisterInput } from "./schema";
import { removeUndefined, request, ApiError } from "../../lib/api";


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
