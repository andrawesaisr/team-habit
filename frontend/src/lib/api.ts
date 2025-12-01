
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

const resolveApiUrl = (path: string) => {
    const base = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
    return new URL(path, base).toString();
};

const jsonHeaders = {
    "Content-Type": "application/json"
} as const;

const parseJson = async <T>(response: Response): Promise<T> => {
    const text = await response.text();
    if (!text) return {} as T;
    try {
        return JSON.parse(text) as T;
    } catch (error) {
        throw new ApiError("Invalid server response", response.status);
    }
};

export const request = async <T>(path: string, init: RequestInit = {}): Promise<T> => {
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

export const removeUndefined = <T extends Record<string, unknown>>(object: T) =>
    Object.fromEntries(
        Object.entries(object).filter(([, value]) => value !== undefined && value !== null)
    ) as T;


export { ApiError };
