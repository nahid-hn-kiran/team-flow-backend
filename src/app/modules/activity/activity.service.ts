import status from "http-status";
import { prisma } from "../../../lib/prisma";
import AppError from "../../errorHelpers/appError";
import { ICreateActivityPayload } from "./activity.interface";
import { Prisma } from "../../../generated/prisma/client";

type PrismaTransactionClient = Prisma.TransactionClient;

const createActivity = async (
  payload: ICreateActivityPayload,
  tx?: PrismaTransactionClient,
) => {
  const db = tx ?? prisma;

  const activity = await db.activity.create({
    data: {
      action: payload.action,
      entityType: payload.entityType,
      entityId: payload.entityId,

      workspaceId: payload.workspaceId,
      projectId: payload.projectId,
      taskId: payload.taskId,

      performedBy: payload.performedBy,

      description: payload.description,
      metadata: payload.metadata,
    },
  });

  return activity;
};

const getWorkspaceActivities = async (workspaceId: string, userId: string) => {
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

  const activities = await prisma.activity.findMany({
    where: {
      workspaceId,
    },
    include: {
      performer: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      project: {
        select: {
          id: true,
          name: true,
        },
      },
      task: {
        select: {
          id: true,
          title: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return activities;
};

const getTaskActivities = async (
  workspaceId: string,
  taskId: string,
  userId: string,
) => {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      isDeleted: false,
      project: {
        workspaceId,
        isDeleted: false,
      },
    },
  });

  if (!task) {
    throw new AppError(status.NOT_FOUND, "Task not found.");
  }

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

  const activities = await prisma.activity.findMany({
    where: {
      workspaceId,
      taskId,
    },
    include: {
      performer: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return activities;
};

export const activityService = {
  createActivity,
  getWorkspaceActivities,
  getTaskActivities,
};
