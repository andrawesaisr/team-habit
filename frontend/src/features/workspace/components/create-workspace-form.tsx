import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { createWorkspaceSchema, type CreateWorkspaceInput } from "../schema";
import { useCreateWorkspaceMutation } from "../hooks";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";

export const CreateWorkspaceForm = () => {
    const mutation = useCreateWorkspaceMutation();

    const form = useForm<CreateWorkspaceInput>({
        defaultValues: {
            name: "",
            description: "",
        },
        onSubmit: async ({ value }) => {
            const parsed = createWorkspaceSchema.parse(value);
            await mutation.mutateAsync(parsed);
        },
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>Create Workspace</CardTitle>
            </CardHeader>
            <CardContent>
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        void form.handleSubmit();
                    }}
                    className="space-y-4"
                >
                    <form.Field
                        name="name"
                        validatorAdapter={zodValidator()}
                        validators={{
                            onSubmit: createWorkspaceSchema.shape.name,
                        }}
                    >
                        {(field) => (
                            <div className="space-y-2">
                                <Label htmlFor={field.name}>Workspace Name</Label>
                                <Input
                                    id={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(event) => field.handleChange(event.target.value)}
                                    disabled={mutation.isPending}
                                />
                                {field.state.meta.touchedErrors ? (
                                    <p className="text-sm text-red-500">
                                        {field.state.meta.touchedErrors.join(", ")}
                                    </p>
                                ) : null}
                            </div>
                        )}
                    </form.Field>

                    <form.Field name="description">
                        {(field) => (
                            <div className="space-y-2">
                                <Label htmlFor={field.name}>Description (Optional)</Label>
                                <Input
                                    id={field.name}
                                    value={field.state.value ?? ""}
                                    onBlur={field.handleBlur}
                                    onChange={(event) => field.handleChange(event.target.value)}
                                    disabled={mutation.isPending}
                                />
                                {field.state.meta.touchedErrors ? (
                                    <p className="text-sm text-red-500">
                                        {field.state.meta.touchedErrors.join(", ")}
                                    </p>
                                ) : null}
                            </div>
                        )}
                    </form.Field>

                    <Button type="submit" disabled={mutation.isPending}>
                        {mutation.isPending ? "Creating..." : "Create Workspace"}
                    </Button>
                    {mutation.isError && <p className="text-red-500">{mutation.error.message}</p>}
                </form>
            </CardContent>
        </Card>
    );
};
