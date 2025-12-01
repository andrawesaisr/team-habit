import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { workspacesQueryOptions } from "../query";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";

export const WorkspaceList = () => {
    const { data, isLoading, isError, error } = useQuery(workspacesQueryOptions());

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>My Workspaces</CardTitle>
            </CardHeader>
            <CardContent>
                <ul>
                    {data?.map((workspace) => (
                        <li key={workspace.id}>
                            <Link to="/workspaces/$workspaceId" params={{ workspaceId: workspace.id }}>
                                {workspace.name} ({workspace.role})
                            </Link>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
};
