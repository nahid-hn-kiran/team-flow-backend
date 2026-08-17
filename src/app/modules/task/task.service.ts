import status from "http-status";
import { prisma } from "../../../lib/prisma";
import AppError from "../../errorHelpers/appError";
import {
  IAssignTaskPayload,
  ICreateTaskPayload,
  IUpdateTaskPayload,
  IUpdateTaskStatusPayload,
} from "./task.interface";
import {
  ActivityAction,
  ActivityEntity,
  WorkspaceRole,
} from "../../../generated/prisma/enums";

const getWorkspaceMembership = async (workspaceId: string, userId: string) => {
  const membership = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId,
        userId,
      },
    },
  });

  if (!membership) {
    throw new AppError(
      status.FORBIDDEN,
      "You are not a member of this workspace.",
    );
  }

  return membership;
};

const getProject = async (workspaceId: string, projectId: string) => {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      workspaceId,
      isDeleted: false,
    },
  });

  if (!project) {
    throw new AppError(
      status.NOT_FOUND,
      "Project not found in this workspace.",
    );
  }

  return project;
};

const createTask = async (
  workspaceId: string,
  projectId: string,
  payload: ICreateTaskPayload,
  userId: string,
) => {
  const membership = await getWorkspaceMembership(workspaceId, userId);

  if (
    membership.role !== WorkspaceRole.OWNER &&
    membership.role !== WorkspaceRole.ADMIN
  ) {
    throw new AppError(
      status.FORBIDDEN,
      "Only workspace owner or admin can create tasks.",
    );
  }

  await getProject(workspaceId, projectId);

  if (payload.assignedTo) {
    const assignee = await prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId: payload.assignedTo,
        },
      },
    });

    if (!assignee) {
      throw new AppError(
        status.BAD_REQUEST,
        "The assigned user is not a member of this workspace.",
      );
    }
  }

  const task = await prisma.$transaction(async (tx) => {
    const createdTask = await tx.task.create({
      data: {
        title: payload.title,
        description: payload.description,
        priority: payload.priority,
        dueDate: payload.dueDate ? new Date(payload.dueDate) : undefined,
        assignedTo: payload.assignedTo,
        createdBy: userId,
        projectId,
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    await tx.activity.create({
      data: {
        action: ActivityAction.CREATED,
        entityType: ActivityEntity.TASK,
        entityId: createdTask.id,

        workspaceId,
        projectId: createdTask.projectId,
        taskId: createdTask.id,

        performedBy: userId,

        description: `Task "${createdTask.title}" was created.`,
      },
    });

    return createdTask;
  });

  return task;
};

const getProjectTasks = async (
  workspaceId: string,
  projectId: string,
  userId: string,
) => {
  await getWorkspaceMembership(workspaceId, userId);

  await getProject(workspaceId, projectId);

  const tasks = await prisma.task.findMany({
    where: {
      projectId,
      isDeleted: false,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      assignee: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      creator: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });

  return tasks;
};

const getTaskById = async (
  workspaceId: string,
  projectId: string,
  taskId: string,
  userId: string,
) => {
  await getWorkspaceMembership(workspaceId, userId);

  await getProject(workspaceId, projectId);

  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      projectId,
      isDeleted: false,
    },
    include: {
      assignee: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      creator: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      comments: {
        where: {
          isDeleted: false,
        },
        orderBy: {
          createdAt: "asc",
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  if (!task) {
    throw new AppError(status.NOT_FOUND, "Task not found.");
  }

  return task;
};

const updateTask = async (
  workspaceId: string,
  projectId: string,
  taskId: string,
  payload: IUpdateTaskPayload,
  userId: string,
) => {
  const membership = await getWorkspaceMembership(workspaceId, userId);

  await getProject(workspaceId, projectId);

  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      projectId,
      isDeleted: false,
    },
  });

  if (!task) {
    throw new AppError(status.NOT_FOUND, "Task not found.");
  }

  const isManager =
    membership.role === WorkspaceRole.OWNER ||
    membership.role === WorkspaceRole.ADMIN;

  if (!isManager) {
    if (task.assignedTo !== userId) {
      throw new AppError(
        status.FORBIDDEN,
        "You can only update tasks assigned to you.",
      );
    }

    const forbiddenFields =
      payload.title !== undefined ||
      payload.priority !== undefined ||
      payload.dueDate !== undefined ||
      payload.assignedTo !== undefined;

    if (forbiddenFields) {
      throw new AppError(
        status.FORBIDDEN,
        "You can only update the description and status of your assigned task.",
      );
    }
  }

  if (payload.assignedTo) {
    const assignee = await prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId: payload.assignedTo,
        },
      },
    });

    if (!assignee) {
      throw new AppError(
        status.BAD_REQUEST,
        "The assigned user is not a member of this workspace.",
      );
    }
  }

  const updatedTask = await prisma.$transaction(async (tx) => {
    const updatedTask = await tx.task.update({
      where: {
        id: taskId,
      },
      data: {
        ...(payload.title !== undefined && {
          title: payload.title,
        }),

        ...(payload.description !== undefined && {
          description: payload.description,
        }),

        ...(payload.priority !== undefined && {
          priority: payload.priority,
        }),

        ...(payload.status !== undefined && {
          status: payload.status,
        }),

        ...(payload.dueDate !== undefined && {
          dueDate: payload.dueDate ? new Date(payload.dueDate) : null,
        }),

        ...(payload.assignedTo !== undefined && {
          assignedTo: payload.assignedTo,
        }),
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    await tx.activity.create({
      data: {
        action: ActivityAction.UPDATED,
        entityType: ActivityEntity.TASK,
        entityId: updatedTask.id,

        workspaceId,
        projectId: updatedTask.projectId,
        taskId: updatedTask.id,

        performedBy: userId,

        description: `Task "${updatedTask.title}" was updated.`,
      },
    });

    return updatedTask;
  });

  return updatedTask;
};

const updateTaskStatus = async (
  workspaceId: string,
  projectId: string,
  taskId: string,
  payload: IUpdateTaskStatusPayload,
  userId: string,
) => {
  const membership = await getWorkspaceMembership(workspaceId, userId);

  await getProject(workspaceId, projectId);

  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      projectId,
      isDeleted: false,
    },
  });

  if (!task) {
    throw new AppError(status.NOT_FOUND, "Task not found.");
  }

  const oldStatus = task.status;
  const newStatus = payload.status;

  const isManager =
    membership.role === WorkspaceRole.OWNER ||
    membership.role === WorkspaceRole.ADMIN;

  if (!isManager && task.assignedTo !== userId) {
    throw new AppError(
      status.FORBIDDEN,
      "You can only update the status of tasks assigned to you.",
    );
  }

  const result = await prisma.$transaction(async (tx) => {
    const updatedTask = await tx.task.update({
      where: {
        id: taskId,
      },
      data: {
        status: newStatus,
      },
    });

    await tx.activity.create({
      data: {
        action: ActivityAction.STATUS_CHANGED,
        entityType: ActivityEntity.TASK,
        entityId: task.id,

        workspaceId,
        projectId: task.projectId,
        taskId: task.id,

        performedBy: userId,

        description: `Task "${task.title}" status changed from ${oldStatus} to ${newStatus}.`,

        metadata: {
          oldStatus,
          newStatus,
        },
      },
    });

    return updatedTask;
  });

  return result;
};

const assignTask = async (
  workspaceId: string,
  projectId: string,
  taskId: string,
  payload: IAssignTaskPayload,
  userId: string,
) => {
  const membership = await getWorkspaceMembership(workspaceId, userId);

  if (
    membership.role !== WorkspaceRole.OWNER &&
    membership.role !== WorkspaceRole.ADMIN
  ) {
    throw new AppError(
      status.FORBIDDEN,
      "Only workspace owner or admin can assign tasks.",
    );
  }

  await getProject(workspaceId, projectId);

  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      projectId,
      isDeleted: false,
    },
  });

  if (!task) {
    throw new AppError(status.NOT_FOUND, "Task not found.");
  }

  if (payload.assignedTo) {
    const assignee = await prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId: payload.assignedTo,
        },
      },
    });

    if (!assignee) {
      throw new AppError(
        status.BAD_REQUEST,
        "The assigned user is not a member of this workspace.",
      );
    }
  }

  const result = await prisma.$transaction(async (tx) => {
    const updatedTask = await tx.task.update({
      where: {
        id: taskId,
      },
      data: {
        assignedTo: payload.assignedTo,
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    await tx.activity.create({
      data: {
        action: ActivityAction.ASSIGNED,
        entityType: ActivityEntity.TASK,
        entityId: task.id,

        workspaceId,
        projectId: task.projectId,
        taskId: task.id,

        performedBy: userId,

        description: payload.assignedTo
          ? `Task "${task.title}" was assigned to ${updatedTask.assignee?.name}.`
          : `Task "${task.title}" was unassigned.`,

        metadata: {
          previousAssigneeId: task.assignedTo,
          newAssigneeId: payload.assignedTo ?? null,
        },
      },
    });

    return updatedTask;
  });

  return result;
};

const deleteTask = async (
  workspaceId: string,
  projectId: string,
  taskId: string,
  userId: string,
) => {
  const membership = await getWorkspaceMembership(workspaceId, userId);

  if (
    membership.role !== WorkspaceRole.OWNER &&
    membership.role !== WorkspaceRole.ADMIN
  ) {
    throw new AppError(
      status.FORBIDDEN,
      "Only workspace owner or admin can delete tasks.",
    );
  }

  await getProject(workspaceId, projectId);

  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      projectId,
      isDeleted: false,
    },
  });

  if (!task) {
    throw new AppError(status.NOT_FOUND, "Task not found.");
  }

  await prisma.$transaction(async (tx) => {
    await tx.task.update({
      where: {
        id: taskId,
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    await tx.activity.create({
      data: {
        action: ActivityAction.DELETED,
        entityType: ActivityEntity.TASK,
        entityId: task.id,

        workspaceId,
        projectId: task.projectId,
        taskId: task.id,

        performedBy: userId,

        description: `Task "${task.title}" was deleted.`,
      },
    });
  });

  return null;
};

export const taskService = {
  createTask,
  getProjectTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
  assignTask,
  deleteTask,
};
