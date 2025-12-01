import {
    createRouter,
    createRoute,
    createRootRouteWithContext,
    redirect
} from "@tanstack/react-router";
import { QueryClient } from "@tanstack/react-query";
import { RootComponent } from "@/routes/root";
import { HomePage } from "@/routes/home";
import { LoginPage } from "@/routes/login";
import { RegisterPage } from "@/routes/register";
import { NotFoundPage } from "@/routes/not-found";
import { Workspaces } from "@/routes/workspaces";
import { WorkspacePage } from "@/routes/workspace";
import { ensureSession } from "@/features/auth/query";

export type RouterContext = {
    queryClient: QueryClient;
};

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1
        }
    }
});

const rootRoute = createRootRouteWithContext<RouterContext>()({
    component: RootComponent
});

const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    beforeLoad: async ({ context }) => {
        const session = await ensureSession(context.queryClient);
        if (!session.user) {
            throw redirect({ to: "/login" });
        }
    },
    component: HomePage
});

const loginRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/login",
    beforeLoad: async ({ context }) => {
        const session = await ensureSession(context.queryClient);
        if (session.user) {
            throw redirect({ to: "/" });
        }
    },
    component: LoginPage
});

const registerRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/register",
    beforeLoad: async ({ context }) => {
        const session = await ensureSession(context.queryClient);
        if (session.user) {
            throw redirect({ to: "/" });
        }
    },
    component: RegisterPage
});

const workspacesRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/workspaces",
    beforeLoad: async ({ context }) => {
        const session = await ensureSession(context.queryClient);
        if (!session.user) {
            throw redirect({ to: "/login" });
        }
    },
    component: Workspaces
});

const workspaceRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/workspaces/$workspaceId",
    beforeLoad: async ({ context }) => {
        const session = await ensureSession(context.queryClient);
        if (!session.user) {
            throw redirect({ to: "/login" });
        }
    },
    component: WorkspacePage
});

const notFoundRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "*",
    component: NotFoundPage
});


const routeTree = rootRoute.addChildren([
    indexRoute,
    loginRoute,
    registerRoute,
    workspacesRoute,
    workspaceRoute,
    notFoundRoute
]);

export const router = createRouter({
    routeTree,
    context: {
        queryClient
    }
});

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}
