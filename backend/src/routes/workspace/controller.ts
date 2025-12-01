import type { Context } from "hono";
import { nanoid } from "nanoid";
import { db } from "../../lib/db/client";
import { workspace, workspaceMember, user } from "../../lib/db/schema";
import { type CreateWorkspacePayload, type InviteMemberPayload } from "./schema";
import { eq, and } from "drizzle-orm";
import { auth } from "../../config/auth";

const authHeaders = (c: Context) => ({
    headers: c.req.raw.headers,
    request: c.req.raw
});

export const createWorkspaceHandler = async (c: Context) => {
    const session = await auth.api.getSession(authHeaders(c));
    if (!session?.user?.id) {
        return c.json({ error: "Unauthorized" }, 401);
    }
    
    const userId = session.user.id;

    const payload = await c.req.json() as CreateWorkspacePayload;

    try {
        const newWorkspaceId = `ws_${nanoid(10)}`;
        const [newWorkspace] = await db.insert(workspace).values({
            id: newWorkspaceId,
            name: payload.name,
            description: payload.description,
            createdBy: userId,
        }).returning();

        if (!newWorkspace) {
            return c.json({ error: "Failed to create workspace" }, 500);
        }

        await db.insert(workspaceMember).values({
            id: `wsm_${nanoid(10)}`,
            workspaceId: newWorkspace.id,
            userId: userId,
            role: "admin",
        }).execute();

        return c.json(newWorkspace, 201);
    } catch (error) {
        console.error("Error creating workspace:", error);
        return c.json({ error: "Internal server error" }, 500);
    }
};

export const listWorkspacesHandler = async (c: Context) => {
    const session = await auth.api.getSession(authHeaders(c));
    
    if (!session?.user?.id) {
        return c.json({ error: "Unauthorized" }, 401);
    }
    
    const userId = session.user.id;

    try {
        const userWorkspaces = await db.query.workspaceMember.findMany({
            where: eq(workspaceMember.userId, userId),
            with: {
                workspace: {
                    columns: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        const formattedWorkspaces = userWorkspaces.map((member) => ({
            id: member.workspace.id,
            name: member.workspace.name,
            role: member.role,
        }));

        return c.json(formattedWorkspaces);
    } catch (error) {
        console.error("Error listing workspaces:", error);
        return c.json({ error: "Internal server error" }, 500);
    }
};

export const getWorkspaceHandler = async (c: Context) => {
    const session = await auth.api.getSession(authHeaders(c));
    if (!session?.user?.id) {
        return c.json({ error: "Unauthorized" }, 401);
    }

    const workspaceId = c.req.param("workspaceId");

    try {
        const result = await db.query.workspace.findFirst({
            where: eq(workspace.id, workspaceId),
            with: {
                members: {
                    with: {
                        user: {
                            columns: {
                                id: true,
                                name: true,
                                email: true,
                                image: true,
                            }
                        }
                    }
                }
            }
        });

        if (!result) {
            return c.json({ error: "Workspace not found" }, 404);
        }

        return c.json(result);
    } catch (error) {
        console.error("Error getting workspace:", error);
        return c.json({ error: "Internal server error" }, 500);
    }
};

export const inviteMemberHandler = async (c: Context) => {
    const session = await auth.api.getSession(authHeaders(c));
    
    if (!session?.user?.id) {
        return c.json({ error: "Unauthorized" }, 401);
    }
    
    const userId = session.user.id;

    const payload = await c.req.json() as InviteMemberPayload;
    try {
        // Check if the inviting user is an admin of the workspace
        const adminCheck = await db.query.workspaceMember.findFirst({
            where: and(
                eq(workspaceMember.workspaceId, payload.workspaceId),
                eq(workspaceMember.userId, userId),
                eq(workspaceMember.role, "admin")
            ),
        });
        console.log("adminCheck: ", adminCheck)

        if (!adminCheck) {
            return c.json({ error: "Forbidden: Only admins can invite members" }, 403);
        }

        // Check if the invited user exists
        const invitedUser = await db.query.user.findFirst({
            where: eq(user.email, payload.email),
        });

        if (!invitedUser) {
            return c.json({ error: "User with this email not found" }, 404);
        }

        // Check if the invited user is already a member
        const existingMember = await db.query.workspaceMember.findFirst({
            where: and(
                eq(workspaceMember.workspaceId, payload.workspaceId),
                eq(workspaceMember.userId, invitedUser.id)
            ),
        });

        if (existingMember) {
            return c.json({ error: "User is already a member of this workspace" }, 409);
        }

        // Add the new member
        await db.insert(workspaceMember).values({
            id: `wsm_${nanoid(10)}`,
            workspaceId: payload.workspaceId,
            userId: invitedUser.id,
            role: "member",
        }).execute();

        return c.json({ success: true }, 200);
    } catch (error) {
        console.error("Error inviting member:", error);
        return c.json({ error: "Internal server error" }, 500);
    }
};
