import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { queryClient, router } from "./router";
import "./index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
    throw new Error("Failed to find root element");
}

ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
            <ReactQueryDevtools initialIsOpen={false} />
            <TanStackRouterDevtools router={router} position="bottom-right" />
        </QueryClientProvider>
    </React.StrictMode>
);
