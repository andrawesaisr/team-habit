import * as React from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLogoutMutation } from "@/features/auth/hooks";
import type { AuthUser } from "@/features/auth/api";

type SiteHeaderProps = {
    user?: AuthUser | null;
    isLoading?: boolean;
};

export const SiteHeader: React.FC<SiteHeaderProps> = ({ user, isLoading }) => {
    const router = useRouter();
    const logoutMutation = useLogoutMutation();

    const handleLogout = async () => {
        await logoutMutation.mutateAsync();
        void router.navigate({ to: "/login" });
    };

    return (
        <header className="border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
                <Link
                    to="/"
                    className="text-lg font-semibold tracking-tight transition-colors hover:text-primary"
                >
                    Team Habit
                </Link>

                <nav className="flex items-center gap-3 text-sm font-medium">
                    {isLoading ? (
                        <span className="text-muted-foreground">Loading…</span>
                    ) : user ? (
                        <>
                            <span className="hidden text-sm text-muted-foreground sm:inline">
                                {user.name ?? user.email}
                            </span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => void handleLogout()}
                                disabled={logoutMutation.isPending}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                Sign out
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="transition-colors hover:text-primary">
                                Sign in
                            </Link>
                            <Button asChild size="sm">
                                <Link to="/register">Create account</Link>
                            </Button>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
};
