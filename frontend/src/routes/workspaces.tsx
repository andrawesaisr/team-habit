import { CreateWorkspaceForm } from "../features/workspace/components/create-workspace-form";
import { WorkspaceList } from "../features/workspace/components/workspace-list";

export const Workspaces = () => {
    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-8">Workspaces</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <CreateWorkspaceForm />
                </div>
                <div>
                    <WorkspaceList />
                </div>
            </div>
        </div>
    );
};
