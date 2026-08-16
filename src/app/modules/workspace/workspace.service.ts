import status from "http-status";
import { prisma } from "../../../lib/prisma";
import AppError from "../../errorHelpers/appError";
import {
  ICreateWorkspacePayload,
  IUpdateWorksspacePayload,
} from "./workspace.interface";
import { WorkspaceRole } from "../../../generated/prisma/enums";

const createWorkspace = async (
  payload: ICreateWorkspacePayload,
  userId: string,
) => {
  const { name, description } = payload;

  const existingWorkspace = await prisma.workspace.findFirst({
    where: {
      name,
      isDeleted: false,
      members: {
        some: {
          userId,
        },
      },
    },
  });

  if (existingWorkspace) {
    throw new AppError(
      status.CONFLICT,
      "You already have a workspace with this name.",
    );
  }

  const result = await prisma.$transaction(async (tx) => {
    const workspace = await tx.workspace.create({
      data: {
        name,
        description,
      },
    });

    await tx.workspaceMember.create({
      data: {
        workspaceId: workspace.id,
        userId,
        role: WorkspaceRole.OWNER,
      },
    });

    return workspace;
  });

  return result;
};

const getMyWorkspaces = async (userId: string) => {
  const result = await prisma.workspaceMember.findMany({
    where: {
      userId,
      workspace: {
        isDeleted: false,
      },
    },
    include: {
      workspace: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

const getWorkspaceById = async (workspaceId: string, userId: string) => {
  const membership = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId,
        userId,
      },
    },
    include: {
      workspace: true,
    },
  });

  if (!membership || membership.workspace.isDeleted) {
    throw new AppError(status.NOT_FOUND, "Workspace not found");
  }

  return {
    ...membership.workspace,
  };
};

const updateWorkspace = async (
  workspaceId: string,
  userId: string,
  payload: IUpdateWorksspacePayload,
) => {
  const membership = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId,
        userId,
      },
    },
  });

  if (!membership) {
    throw new AppError(status.NOT_FOUND, "Workspace not found");
  }

  if (
    membership.role !== WorkspaceRole.OWNER &&
    membership.role !== WorkspaceRole.ADMIN
  ) {
    throw new AppError(
      status.FORBIDDEN,
      "You do not have permission to update this workspace.",
    );
  }

  const workspace = await prisma.workspace.findFirst({
    where: {
      id: workspaceId,
      isDeleted: false,
    },
  });

  if (!workspace) {
    throw new AppError(status.NOT_FOUND, "Workspace not found.");
  }

  if (payload.name && payload.name !== workspace.name) {
    const duplicateWorkspace = await prisma.workspace.findFirst({
      where: {
        name: payload.name,
        isDeleted: false,
        members: {
          some: {
            userId,
          },
        },
        NOT: {
          id: workspaceId,
        },
      },
    });

    if (duplicateWorkspace) {
      throw new AppError(
        status.CONFLICT,
        "You already have a workspace with this name.",
      );
    }

    return prisma.workspace.update({
      where: {
        id: workspaceId,
      },
      data: payload,
    });
  }

  return membership;
};

const deleteWorkspace = async (workspaceId: string, userId: string) => {
  const membership = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId,
        userId,
      },
    },
  });

  if (!membership) {
    throw new AppError(status.NOT_FOUND, "Workspace not found.");
  }

  if (membership.role !== WorkspaceRole.OWNER) {
    throw new AppError(
      status.FORBIDDEN,
      "Only the workspace owner can delete the workspace.",
    );
  }

  const workspace = await prisma.workspace.findFirst({
    where: {
      id: workspaceId,
      isDeleted: false,
    },
  });

  if (!workspace) {
    throw new AppError(status.NOT_FOUND, "Workspace not found.");
  }

  await prisma.workspace.update({
    where: {
      id: workspaceId,
    },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });

  return null;
};

export const workspaceService = {
  createWorkspace,
  getMyWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
};
