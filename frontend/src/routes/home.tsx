import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { sessionQueryOptions } from "@/features/auth/query";

export const HomePage = () => {
    const sessionQuery = useQuery(sessionQueryOptions());
    const user = sessionQuery.data?.user ?? null;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
                <p className="text-muted-foreground">
                    Manage your habits, track your progress, and stay consistent with your team.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Account overview</CardTitle>
                    <CardDescription>Your authentication session details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <p>
                        <span className="font-medium">Status:</span>{" "}
                        {sessionQuery.isLoading
                            ? "Loading…"
                            : user
                                ? "Signed in"
                                : "Signed out"}
                    </p>
                    {user ? (
                        <>
                            <p>
                                <span className="font-medium">Name:</span> {user.name ?? "—"}
                            </p>
                            <p>
                                <span className="font-medium">Email:</span> {user.email}
                            </p>
                        </>
                    ) : null}
                </CardContent>
            </Card>
        </div>
    );
};
