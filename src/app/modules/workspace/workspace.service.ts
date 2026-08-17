import status from "http-status";
import { prisma } from "../../../lib/prisma";
import AppError from "../../errorHelpers/appError";
import {
  IAddWorkspaceMemberPayload,
  ICreateWorkspacePayload,
  IUpdateWorkspaceMemberPayload,
  IUpdateWorksspacePayload,
} from "./workspace.interface";
import {
  ActivityAction,
  ActivityEntity,
  UserStatus,
  WorkspaceRole,
} from "../../../generated/prisma/enums";

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

    await tx.activity.create({
      data: {
        action: ActivityAction.CREATED,
        entityType: ActivityEntity.WORKSPACE,
        entityId: workspace.id,
        workspaceId: workspace.id,
        performedBy: userId,
        description: `Workspace "${workspace.name}" was created.`,
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
  }

  const result = await prisma.$transaction(async (tx) => {
    const updatedWorkspace = await tx.workspace.update({
      where: {
        id: workspaceId,
      },
      data: payload,
    });

    await tx.activity.create({
      data: {
        action: ActivityAction.UPDATED,
        entityType: ActivityEntity.WORKSPACE,
        entityId: workspaceId,
        workspaceId,
        performedBy: userId,
        description: `Workspace "${updatedWorkspace.name}" was updated.`,
        metadata: {
          oldName: workspace.name,
          newName: updatedWorkspace.name,
        },
      },
    });

    return updatedWorkspace;
  });

  return result;
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

  await prisma.$transaction(async (tx) => {
    await tx.workspace.update({
      where: {
        id: workspaceId,
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    await tx.activity.create({
      data: {
        action: ActivityAction.DELETED,
        entityType: ActivityEntity.WORKSPACE,
        entityId: workspaceId,
        workspaceId,
        performedBy: userId,
        description: `Workspace "${workspace.name}" was deleted.`,
      },
    });
  });

  return null;
};

const addMember = async (
  workspaceId: string,
  requesterId: string,
  payload: IAddWorkspaceMemberPayload,
) => {
  const { email, role = WorkspaceRole.MEMBER } = payload;

  const requester = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId,
        userId: requesterId,
      },
    },
  });

  if (!requester) {
    throw new AppError(status.NOT_FOUND, "Workspace not found");
  }

  if (
    requester.role !== WorkspaceRole.OWNER &&
    requester.role !== WorkspaceRole.ADMIN
  ) {
    throw new AppError(
      status.FORBIDDEN,
      "You do not have permission to add members",
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

  const user = await prisma.user.findFirst({
    where: {
      email,
      isDeleted: false,
      status: UserStatus.ACTIVE,
    },
  });

  if (!user) {
    throw new AppError(status.NOT_FOUND, "No user found with this email");
  }

  const existingMember = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId,
        userId: user.id,
      },
    },
  });

  if (existingMember) {
    throw new AppError(
      status.CONFLICT,
      "User is already a member of this workspace",
    );
  }

  if (requester.role === WorkspaceRole.ADMIN && role === WorkspaceRole.ADMIN) {
    throw new AppError(
      status.FORBIDDEN,
      "Only the workspace owner can assign the ADMIN role.",
    );
  }

  const result = await prisma.$transaction(async (tx) => {
    const member = await tx.workspaceMember.create({
      data: {
        workspaceId,
        userId: user.id,
        role,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            status: true,
          },
        },
      },
    });

    await tx.activity.create({
      data: {
        action: ActivityAction.MEMBER_ADDED,
        entityType: ActivityEntity.MEMBER,
        entityId: member.id,

        workspaceId,

        performedBy: requesterId,

        description: `${member.user.name} was added to the workspace.`,

        metadata: {
          userId: member.user.id,
          role: member.role,
        },
      },
    });

    return member;
  });

  return result;
};

const getWorkspaceMembers = async (
  workspaceId: string,
  requesterId: string,
) => {
  const requester = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId,
        userId: requesterId,
      },
    },
  });

  if (!requester) {
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

  const members = await prisma.workspaceMember.findMany({
    where: {
      workspaceId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          status: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return members;
};

const getWorkspaceMember = async (
  workspaceId: string,
  requesterId: string,
  memberId: string,
) => {
  const requester = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId,
        userId: requesterId,
      },
    },
  });

  if (!requester) {
    throw new AppError(status.NOT_FOUND, "Workspace not found.");
  }

  const member = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId,
        userId: memberId,
      },
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          status: true,
        },
      },
    },
  });

  if (!member) {
    throw new AppError(status.NOT_FOUND, "Member not found.");
  }

  return member;
};

const updateMemberRole = async (
  workspaceId: string,
  requesterId: string,
  memberId: string,
  payload: IUpdateWorkspaceMemberPayload,
) => {
  const requester = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId,
        userId: requesterId,
      },
    },
  });

  if (!requester) {
    throw new AppError(status.NOT_FOUND, "Workspace not found.");
  }

  if (requester.role !== WorkspaceRole.OWNER) {
    throw new AppError(
      status.FORBIDDEN,
      "Only the workspace owner can change member roles.",
    );
  }

  const member = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId,
        userId: memberId,
      },
    },
  });

  if (!member) {
    throw new AppError(status.NOT_FOUND, "Member not found.");
  }

  if (member.role === WorkspaceRole.OWNER) {
    throw new AppError(
      status.FORBIDDEN,
      "The workspace owner's role cannot be changed.",
    );
  }

  const result = await prisma.$transaction(async (tx) => {
    const updatedMember = await tx.workspaceMember.update({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId: memberId,
        },
      },
      data: {
        role: payload.role,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            status: true,
          },
        },
      },
    });

    await tx.activity.create({
      data: {
        action: ActivityAction.UPDATED,
        entityType: ActivityEntity.MEMBER,
        entityId: updatedMember.id,

        workspaceId,

        performedBy: requesterId,

        description: `${updatedMember.user.name}'s workspace role was changed from ${member.role} to ${updatedMember.role}.`,

        metadata: {
          userId: updatedMember.user.id,
          oldRole: member.role,
          newRole: updatedMember.role,
        },
      },
    });

    return updatedMember;
  });

  return result;
};

const removeMember = async (
  workspaceId: string,
  requesterId: string,
  memberId: string,
) => {
  const requester = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId,
        userId: requesterId,
      },
    },
  });

  if (!requester) {
    throw new AppError(status.NOT_FOUND, "Workspace not found.");
  }

  if (
    requester.role !== WorkspaceRole.OWNER &&
    requester.role !== WorkspaceRole.ADMIN
  ) {
    throw new AppError(
      status.FORBIDDEN,
      "You do not have permission to remove members.",
    );
  }

  const member = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId,
        userId: memberId,
      },
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!member) {
    throw new AppError(status.NOT_FOUND, "Member not found.");
  }

  if (member.role === WorkspaceRole.OWNER) {
    throw new AppError(
      status.FORBIDDEN,
      "The workspace owner cannot be removed.",
    );
  }

  if (
    requester.role === WorkspaceRole.ADMIN &&
    member.role === WorkspaceRole.ADMIN
  ) {
    throw new AppError(
      status.FORBIDDEN,
      "An admin cannot remove another admin.",
    );
  }

  await prisma.$transaction(async (tx) => {
    await tx.workspaceMember.delete({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId: memberId,
        },
      },
    });

    await tx.activity.create({
      data: {
        action: ActivityAction.MEMBER_REMOVED,
        entityType: ActivityEntity.MEMBER,
        entityId: member.id,

        workspaceId,

        performedBy: requesterId,

        description: `${member.user.name} was removed from the workspace.`,

        metadata: {
          userId: member.user.id,
          role: member.role,
        },
      },
    });
  });

  return null;
};

export const workspaceService = {
  createWorkspace,
  getMyWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,

  // Member
  addMember,
  getWorkspaceMembers,
  getWorkspaceMember,
  updateMemberRole,
  removeMember,
};
