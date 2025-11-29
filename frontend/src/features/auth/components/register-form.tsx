import * as React from "react";
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ApiError } from "../api";
import { useRegisterMutation } from "../hooks";
import {
    emailSchema,
    passwordSchema,
    registerSchema,
    type RegisterInput
} from "../schema";

const toErrorMessage = (error: unknown) => {
    if (!error) return undefined;
    if (error instanceof ApiError) return error.message;
    if (error instanceof Error) return error.message;
    return "Unexpected error";
};

export const RegisterForm: React.FC = () => {
    const registerMutation = useRegisterMutation();

    const form = useForm<RegisterInput>({
        defaultValues: {
            name: "",
            email: "",
            password: "",
            image: "",
            rememberMe: true
        },
        onSubmit: async ({ value }) => {
            const parsed = registerSchema.parse({
                ...value,
                image: value.image ? value.image : undefined
            });
            await registerMutation.mutateAsync(parsed);
        }
    });

    const globalError = toErrorMessage(registerMutation.error);

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
                    name="name"
                    validatorAdapter={zodValidator()}
                    validators={{
                        onSubmit: registerSchema.shape.name
                    }}
                >
                    {(field) => (
                        <div className="space-y-2">
                            <Label htmlFor={field.name}>Full name</Label>
                            <Input
                                id={field.name}
                                autoComplete="name"
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(event) => field.handleChange(event.target.value)}
                                disabled={registerMutation.isPending}
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
                    name="email"
                    validatorAdapter={zodValidator()}
                    validators={{
                        onSubmit: emailSchema
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
                                disabled={registerMutation.isPending}
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
                        onSubmit: passwordSchema
                    }}
                >
                    {(field) => (
                        <div className="space-y-2">
                            <Label htmlFor={field.name}>Password</Label>
                            <Input
                                id={field.name}
                                type="password"
                                autoComplete="new-password"
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(event) => field.handleChange(event.target.value)}
                                disabled={registerMutation.isPending}
                            />
                            {field.state.meta.touchedErrors ? (
                                <p className="text-sm text-destructive">
                                    {field.state.meta.touchedErrors.join(", ")}
                                </p>
                            ) : null}
                        </div>
                    )}
                </form.Field>

                <form.Field name="image">
                    {(field) => (
                        <div className="space-y-2">
                            <Label htmlFor={field.name}>Avatar URL (optional)</Label>
                            <Input
                                id={field.name}
                                type="url"
                                placeholder="https://example.com/avatar.png"
                                value={field.state.value ?? ""}
                                onBlur={field.handleBlur}
                                onChange={(event) => field.handleChange(event.target.value)}
                                disabled={registerMutation.isPending}
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
                                checked={field.state.value ?? false}
                                onChange={(event) => field.handleChange(event.target.checked)}
                                onBlur={field.handleBlur}
                                disabled={registerMutation.isPending}
                                className="h-4 w-4 rounded border border-input text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            />
                            <span>Keep me signed in</span>
                        </label>
                    )}
                </form.Field>
            </div>

            <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
                <UserPlus className="mr-2 h-4 w-4" />
                {registerMutation.isPending ? "Creating account..." : "Create account"}
            </Button>
        </form>
    );
};
