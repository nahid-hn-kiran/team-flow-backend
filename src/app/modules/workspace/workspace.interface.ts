export interface ICreateWorkspacePayload {
  name: string;
  description?: string;
}

export interface IUpdateWorksspacePayload {
  name?: string;
  decription?: string;
}

export interface IAddWorkspaceMemberPayload {
  userId: string;
  role?: "ADMIN" | "MEMBER";
}
