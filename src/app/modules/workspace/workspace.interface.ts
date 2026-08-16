import { WorkspaceRole } from "../../../generated/prisma/enums";

export interface ICreateWorkspacePayload {
  name: string;
  description?: string;
}

export interface IUpdateWorksspacePayload {
  name?: string;
  decription?: string;
}

export interface IAddWorkspaceMemberPayload {
  email: string;
  role?: "ADMIN" | "MEMBER";
}

export interface IUpdateWorkspaceMemberPayload {
  role: WorkspaceRole;
}
