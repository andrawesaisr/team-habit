import type { CreateWorkspaceInput, InviteMemberInput } from "./schema";
import { ApiError, request } from "../../lib/api";

export type Workspace = {
    id: string;
    name: string;
    description?: string | null;
    createdBy: string;
    members: {
        role: "admin" | "member";
        user: {
            id: string;
            name: string;
            email: string;
            image?: string | null;
        }
    }[];
};

export type WorkspaceMember = {
    id: string;
    name: string;
    role: "admin" | "member";
};

export const createWorkspace = async (payload: CreateWorkspaceInput) =>
    request<Workspace>("/workspaces/workspace.create", {
        method: "POST",
        body: JSON.stringify(payload),
    });

export const listWorkspaces = async () =>
    request<WorkspaceMember[]>("/workspaces/workspace.list", { method: "GET" });

export const getWorkspace = async (workspaceId: string) =>
    request<Workspace>(`/workspaces/${workspaceId}`, { method: "GET" });

export const inviteMember = async (payload: InviteMemberInput) =>
    request<{ success: boolean }>("/workspaces/workspace.invite", {
        method: "POST",
        body: JSON.stringify(payload),
    });

export { ApiError };
