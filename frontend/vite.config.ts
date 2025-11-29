import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");

    return {
        plugins: [react()],
        resolve: {
            alias: {
                "@": "/src"
            }
        },
        server: {
            port: 5173,
            open: true,
            proxy: env.VITE_API_PROXY === "true"
                ? {
                      "/auth": {
                          target: env.VITE_API_URL ?? "http://localhost:3000",
                          changeOrigin: true,
                          secure: false
                      }
                  }
                : undefined
        }
    };
});
