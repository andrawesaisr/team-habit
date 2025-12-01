import { z } from "zod";

export const createWorkspaceSchema = z
    .object({
        name: z.string().min(1, "Name cannot be empty").max(120, "Name is too long"),
        description: z.string().max(255, "Description is too long").optional(),
    })
    .strict();

export const inviteMemberSchema = z
    .object({
        workspaceId: z.string(),
        email: z.string().email("Email must be valid"),
    })
    .strict();

export type CreateWorkspacePayload = z.infer<typeof createWorkspaceSchema>;
export type InviteMemberPayload = z.infer<typeof inviteMemberSchema>;
