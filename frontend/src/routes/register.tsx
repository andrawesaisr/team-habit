import { Link } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RegisterForm } from "@/features/auth/components/register-form";

export const RegisterPage = () => (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6">
        <Card>
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-semibold tracking-tight">
                    Create an account
                </CardTitle>
                <CardDescription>
                    Join your team and start tracking better habits together.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <RegisterForm />
            </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">
                Sign in here
            </Link>
        </p>
    </div>
);
