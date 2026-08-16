import status from "http-status";
import { prisma } from "../../../lib/prisma";
import AppError from "../../errorHelpers/appError";
import {
  ICreateProjectPayload,
  IUpdateProjectPayload,
} from "./project.interface";
import { WorkspaceRole } from "../../../generated/prisma/enums";

const createProject = async (
  workspaceId: string,
  userId: string,
  payload: ICreateProjectPayload,
) => {
  const { name, description } = payload;

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

  if (
    membership.role !== WorkspaceRole.OWNER &&
    membership.role !== WorkspaceRole.ADMIN
  ) {
    throw new AppError(
      status.FORBIDDEN,
      "You do not have permission to create a project.",
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

  const existingProject = await prisma.project.findFirst({
    where: {
      workspaceId,
      name,
      isDeleted: false,
    },
  });

  if (existingProject) {
    throw new AppError(
      status.CONFLICT,
      "A project with this name already exists in this workspace.",
    );
  }

  const project = await prisma.project.create({
    data: {
      name,
      description,
      workspaceId,
    },
  });

  return project;
};

const getWorkspaceProjects = async (workspaceId: string, userId: string) => {
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

  const workspace = await prisma.workspace.findFirst({
    where: {
      id: workspaceId,
      isDeleted: false,
    },
  });

  if (!workspace) {
    throw new AppError(status.NOT_FOUND, "Workspace not found.");
  }

  const projects = await prisma.project.findMany({
    where: {
      workspaceId,
      isDeleted: false,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return projects;
};

const getProjectById = async (
  workspaceId: string,
  projectId: string,
  userId: string,
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
    throw new AppError(status.NOT_FOUND, "Workspace not found.");
  }

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      workspaceId,
      isDeleted: false,
    },
    include: {
      _count: {
        select: {
          tasks: true,
        },
      },
    },
  });

  if (!project) {
    throw new AppError(status.NOT_FOUND, "Project not found.");
  }

  return project;
};

const updateProject = async (
  workspaceId: string,
  projectId: string,
  userId: string,
  payload: IUpdateProjectPayload,
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
    throw new AppError(status.NOT_FOUND, "Workspace not found.");
  }

  if (
    membership.role !== WorkspaceRole.OWNER &&
    membership.role !== WorkspaceRole.ADMIN
  ) {
    throw new AppError(
      status.FORBIDDEN,
      "You do not have permission to update projects.",
    );
  }

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      workspaceId,
      isDeleted: false,
    },
  });

  if (!project) {
    throw new AppError(status.NOT_FOUND, "Project not found.");
  }

  if (payload.name && payload.name !== project.name) {
    const duplicateProject = await prisma.project.findFirst({
      where: {
        workspaceId,
        name: payload.name,
        isDeleted: false,
        NOT: {
          id: projectId,
        },
      },
    });

    if (duplicateProject) {
      throw new AppError(
        status.CONFLICT,
        "A project with this name already exists in this workspace.",
      );
    }
  }

  return prisma.project.update({
    where: {
      id: projectId,
    },
    data: payload,
  });
};

const deleteProject = async (
  workspaceId: string,
  projectId: string,
  userId: string,
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
    throw new AppError(status.NOT_FOUND, "Workspace not found.");
  }

  if (membership.role !== WorkspaceRole.OWNER) {
    throw new AppError(
      status.FORBIDDEN,
      "Only the workspace owner can delete a project.",
    );
  }

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      workspaceId,
      isDeleted: false,
    },
  });

  if (!project) {
    throw new AppError(status.NOT_FOUND, "Project not found.");
  }

  await prisma.project.update({
    where: {
      id: projectId,
    },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });

  return null;
};

export const projectService = {
  createProject,
  getWorkspaceProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
