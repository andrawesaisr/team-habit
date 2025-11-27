type RequiredEnv = {
    NODE_ENV: string;
    PORT: number;
    APP_URL: string;
    AUTH_SECRET?: string;
};

const parsePort = (value: string | undefined, fallback: number) => {
    if (!value) return fallback;
    const num = Number.parseInt(value, 10);
    return Number.isFinite(num) ? num : fallback;
};

const nodeEnv = Bun.env.NODE_ENV ?? "development";
const port = parsePort(Bun.env.PORT, 3000);

const inferredAppUrl = (() => {
    const explicit = Bun.env.APP_URL;
    if (explicit && explicit.trim().length > 0) return explicit;
    const protocol = nodeEnv === "production" ? "https" : "http";
    return `${protocol}://localhost:${port}`;
})();

export const env: RequiredEnv = {
    NODE_ENV: nodeEnv,
    PORT: port,
    APP_URL: inferredAppUrl,
    AUTH_SECRET: Bun.env.AUTH_SECRET
};

export const isProduction = env.NODE_ENV === "production";
