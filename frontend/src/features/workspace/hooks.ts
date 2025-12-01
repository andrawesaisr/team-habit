import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createWorkspace, inviteMember, ApiError } from "./api";
import { workspaceKeys } from "./query";

export const useCreateWorkspaceMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createWorkspace,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: workspaceKeys.list() });
        },
    });
};

export const useInviteMemberMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: inviteMember,
        onSuccess: async (data, variables) => {
            console.log("variables.workspaceId: ", variables.workspaceId);
            // Optionally, you can invalidate queries to refetch members,
            // but for now, we'll just invalidate the workspace list.
            await queryClient.invalidateQueries({ queryKey: workspaceKeys.detail(variables.workspaceId) });
        },
    });
};
