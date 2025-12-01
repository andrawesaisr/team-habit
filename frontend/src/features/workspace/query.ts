import { queryOptions, type UseQueryResult } from "@tanstack/react-query";
import { getWorkspace, listWorkspaces } from "./api";

export const workspaceKeys = {
    all: ["workspaces"] as const,
    list: () => [...workspaceKeys.all, "list"] as const,
    detail: (workspaceId: string) => [...workspaceKeys.all, "detail", workspaceId] as const,
};

export const workspacesQueryOptions = () =>
    queryOptions({
        queryKey: workspaceKeys.list(),
        queryFn: listWorkspaces,
    });

export const workspaceQueryOptions = (workspaceId: string) =>
    queryOptions({
        queryKey: workspaceKeys.detail(workspaceId),
        queryFn: () => getWorkspace(workspaceId),
    });


export type WorkspacesQueryResult = UseQueryResult<
    Awaited<ReturnType<typeof listWorkspaces>>
>;

export type WorkspaceQueryResult = UseQueryResult<
    Awaited<ReturnType<typeof getWorkspace>>
>;
