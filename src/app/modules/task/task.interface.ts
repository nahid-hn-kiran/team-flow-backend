import {
  TaskPriority,
  TaskStatus,
  WorkspaceRole,
} from "../../../generated/prisma/enums";

export interface ICreateTaskPayload {
  title: string;
  description?: string;
  priority?: TaskPriority;
  dueDate?: string | Date;
  assignedTo?: string;
}

export interface IUpdateTaskPayload {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  dueDate?: string | Date | null;
  assignedTo?: string | null;
  status?: TaskStatus;
}

export interface IUpdateTaskStatusPayload {
  status: TaskStatus;
}

export interface IAssignTaskPayload {
  assignedTo: string | null;
}

export interface ITaskAuthorization {
  userId: string;
  workspaceRole: WorkspaceRole;
}
