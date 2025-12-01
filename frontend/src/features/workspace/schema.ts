import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>;

export const inviteMemberSchema = z.object({
  workspaceId: z.string(),
  email: z.string().email("Invalid email"),
});

export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;
