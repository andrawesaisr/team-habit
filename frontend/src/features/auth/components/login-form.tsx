import * as React from "react";
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ApiError } from "../api";
import { useLoginMutation } from "../hooks";
import { emailSchema, loginSchema, passwordSchema, type LoginInput } from "../schema";

const toErrorMessage = (error: unknown) => {
    if (!error) return undefined;
    if (error instanceof ApiError) return error.message;
    if (error instanceof Error) return error.message;
    return "Unexpected error";
};

export const LoginForm: React.FC = () => {
    const loginMutation = useLoginMutation();

    const form = useForm<LoginInput>({
        defaultValues: {
            email: "",
            password: "",
            rememberMe: true
        },
        onSubmit: async ({ value }) => {
            const payload = loginSchema.parse(value);
            await loginMutation.mutateAsync(payload);
        }
    });

    const globalError = toErrorMessage(loginMutation.error);

    return (
        <form
            className="space-y-6"
            onSubmit={(event) => {
                event.preventDefault();
                void form.handleSubmit();
            }}
        >
            {globalError ? (
                <Alert variant="destructive">
                    <AlertDescription>{globalError}</AlertDescription>
                </Alert>
            ) : null}

            <div className="space-y-4">
                <form.Field
                    name="email"
                    validatorAdapter={zodValidator()}
                    validators={{
                        onChange: emailSchema
                    }}
                >
                    {(field) => (
                        <div className="space-y-2">
                            <Label htmlFor={field.name}>Email</Label>
                            <Input
                                id={field.name}
                                type="email"
                                autoComplete="email"
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(event) => field.handleChange(event.target.value)}
                                disabled={loginMutation.isPending}
                            />
                            {field.state.meta.touchedErrors ? (
                                <p className="text-sm text-destructive">
                                    {field.state.meta.touchedErrors.join(", ")}
                                </p>
                            ) : null}
                        </div>
                    )}
                </form.Field>

                <form.Field
                    name="password"
                    validatorAdapter={zodValidator()}
                    validators={{
                        onChange: passwordSchema
                    }}
                >
                    {(field) => (
                        <div className="space-y-2">
                            <Label htmlFor={field.name}>Password</Label>
                            <Input
                                id={field.name}
                                type="password"
                                autoComplete="current-password"
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(event) => field.handleChange(event.target.value)}
                                disabled={loginMutation.isPending}
                            />
                            {field.state.meta.touchedErrors ? (
                                <p className="text-sm text-destructive">
                                    {field.state.meta.touchedErrors.join(", ")}
                                </p>
                            ) : null}
                        </div>
                    )}
                </form.Field>

                <form.Field name="rememberMe">
                    {(field) => (
                        <label className="flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={field.state.value}
                                onChange={(event) => field.handleChange(event.target.checked)}
                                onBlur={field.handleBlur}
                                disabled={loginMutation.isPending}
                                className="h-4 w-4 rounded border border-input text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            />
                            <span>Remember me</span>
                        </label>
                    )}
                </form.Field>
            </div>

            <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
                <LogIn className="mr-2 h-4 w-4" />
                {loginMutation.isPending ? "Signing in..." : "Sign in"}
            </Button>
        </form>
    );
};
