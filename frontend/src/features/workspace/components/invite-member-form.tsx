import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { inviteMemberSchema, type InviteMemberInput } from "../schema";
import { useInviteMemberMutation } from "../hooks";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";

export const InviteMemberForm = ({ workspaceId }: { workspaceId: string }) => {
    const mutation = useInviteMemberMutation();

    const form = useForm<InviteMemberInput>({
        defaultValues: {
            email: "",
            workspaceId,
        },
        onSubmit: async ({ value }) => {
            const parsed = inviteMemberSchema.parse(value);
            await mutation.mutateAsync(parsed);
        },
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>Invite Member</CardTitle>
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
                        name="email"
                        validatorAdapter={zodValidator()}
                        validators={{
                            onSubmit: inviteMemberSchema.shape.email,
                        }}
                    >
                        {(field) => (
                            <div className="space-y-2">
                                <Label htmlFor={field.name}>Email</Label>
                                <Input
                                    id={field.name}
                                    type="email"
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

                    <Button type="submit" disabled={mutation.isPending}>
                        {mutation.isPending ? "Inviting..." : "Invite Member"}
                    </Button>
                    {mutation.isError && <p className="text-red-500">{mutation.error.message}</p>}
                    {mutation.isSuccess && <p className="text-green-500">Invitation sent!</p>}
                </form>
            </CardContent>
        </Card>
    );
};
