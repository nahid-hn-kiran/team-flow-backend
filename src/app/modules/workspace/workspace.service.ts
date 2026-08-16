import status from "http-status";
import { prisma } from "../../../lib/prisma";
import AppError from "../../errorHelpers/appError";
import { ICreateWorkspacePayload } from "./workspace.interface";
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

export const workspaceService = {
  createWorkspace,
};
