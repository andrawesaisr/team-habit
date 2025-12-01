import { useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { workspaceQueryOptions } from "../features/workspace/query";
import { InviteMemberForm } from "../features/workspace/components/invite-member-form";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { useState } from "react";

export const WorkspacePage = () => {
    const [clicked, setClicked] = useState(false);
    const { workspaceId } = useParams({ from: "/workspaces/$workspaceId" });
    const { data: workspace, isLoading, isError, error } = useQuery(workspaceQueryOptions(workspaceId));

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error: {error.message}</div>;
    }

    if (!workspace) {
        return <div>Workspace not found</div>;
    }

    return (
        <div className="container mx-auto py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">{workspace.name}</h1>
                <p className="text-muted-foreground">{workspace.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Members</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-4">
                                {workspace.members.map((member) => (
                                    <li key={member.user.id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <Avatar>
                                                <AvatarImage src={member.user.image ?? undefined} alt={member.user.name} />
                                                <AvatarFallback>{member.user.name?.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{member.user.name}</p>
                                                <p className="text-sm text-muted-foreground">{member.user.email}</p>
                                            </div>
                                        </div>
                                        <span className="text-sm text-muted-foreground capitalize">{member.role}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
                <div>
                    <InviteMemberForm workspaceId={workspaceId} />
                </div>
            </div>
        </div>
    );
};
