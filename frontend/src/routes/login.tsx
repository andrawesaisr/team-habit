import { Link } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/features/auth/components/login-form";

export const LoginPage = () => (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6">
        <Card>
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-semibold tracking-tight">Sign in</CardTitle>
                <CardDescription>
                    Access your workspace with your email and password.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <LoginForm />
            </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="font-medium text-primary hover:underline">
                Create one now
            </Link>
        </p>
    </div>
);
