import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import {
    createWorkspaceHandler,
    getWorkspaceHandler,
    inviteMemberHandler,
    listWorkspacesHandler,
} from "./controller";
import { createWorkspaceSchema, inviteMemberSchema } from "./schema";

export const workspaceRouter = new Hono();

workspaceRouter.post(
    "/workspace.create",
    zValidator("json", createWorkspaceSchema),
    createWorkspaceHandler
);
workspaceRouter.get("/workspace.list", listWorkspacesHandler);
workspaceRouter.get("/:workspaceId", getWorkspaceHandler);
workspaceRouter.post(
    "/workspace.invite",
    zValidator("json", inviteMemberSchema),
    inviteMemberHandler
);
