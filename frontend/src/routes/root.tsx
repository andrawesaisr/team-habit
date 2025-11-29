import { Outlet } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteHeader } from "@/components/layout/site-header";
import { sessionQueryOptions } from "@/features/auth/query";

export const RootComponent = () => {
    const sessionQuery = useQuery(sessionQueryOptions());

    return (
        <div className="flex min-h-screen flex-col bg-muted/10">
            <SiteHeader
                user={sessionQuery.data?.user}
                isLoading={sessionQuery.isLoading}
            />

            <main className="flex-1">
                <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
