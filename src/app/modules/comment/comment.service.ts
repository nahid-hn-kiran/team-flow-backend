import status from "http-status";
import { prisma } from "../../../lib/prisma";
import AppError from "../../errorHelpers/appError";
import {
  ICreateCommentPayload,
  IUpdateCommentPayload,
} from "./comment.interface";
import { WorkspaceRole } from "../../../generated/prisma/enums";

const checkTaskAccess = async (
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
        workspace: {
          isDeleted: false,
        },
      },
    },
    include: {
      project: {
        include: {
          workspace: {
            include: {
              members: {
                where: {
                  userId,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!task) {
    throw new AppError(status.NOT_FOUND, "Task not found");
  }

  const membership = task.project.workspace.members[0];

  if (!membership) {
    throw new AppError(
      status.FORBIDDEN,
      "You are not a member of this workspace.",
    );
  }

  return {
    task,
    membership,
  };
};

const getTaskComments = async (
  workspaceId: string,
  taskId: string,
  userId: string,
) => {
  await checkTaskAccess(workspaceId, taskId, userId);

  const comments = await prisma.comment.findMany({
    where: {
      taskId,
      isDeleted: false,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return comments;
};

const getCommentById = async (
  workspaceId: string,
  taskId: string,
  commentId: string,
  userId: string,
) => {
  await checkTaskAccess(workspaceId, taskId, userId);

  const comment = await prisma.comment.findFirst({
    where: {
      id: commentId,
      taskId,
      isDeleted: false,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });

  if (!comment) {
    throw new AppError(status.NOT_FOUND, "Comment not found");
  }

  return comment;
};

const createComment = async (
  workspaceId: string,
  taskId: string,
  payload: ICreateCommentPayload,
  userId: string,
) => {
  await checkTaskAccess(workspaceId, taskId, userId);

  const comment = await prisma.comment.create({
    data: {
      content: payload.content,
      taskId,
      authorId: userId,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });

  return comment;
};

const updateComment = async (
  workspaceId: string,
  taskId: string,
  commentId: string,
  payload: IUpdateCommentPayload,
  userId: string,
) => {
  const { membership } = await checkTaskAccess(workspaceId, taskId, userId);

  const comment = await prisma.comment.findFirst({
    where: {
      id: commentId,
      taskId,
      isDeleted: false,
    },
  });

  if (!comment) {
    throw new AppError(status.NOT_FOUND, "Comment not found");
  }

  const isOwner = comment.authorId === userId;

  const isWorkspaceAuthority =
    membership.role === WorkspaceRole.OWNER ||
    membership.role === WorkspaceRole.ADMIN;

  if (!isOwner && !isWorkspaceAuthority) {
    throw new AppError(
      status.FORBIDDEN,
      "You can only update your own comments.",
    );
  }

  const updatedComment = await prisma.comment.update({
    where: {
      id: commentId,
    },
    data: {
      content: payload.content,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });

  return updatedComment;
};

const deleteComment = async (
  workspaceId: string,
  taskId: string,
  commentId: string,
  userId: string,
) => {
  const { membership } = await checkTaskAccess(workspaceId, taskId, userId);

  const comment = await prisma.comment.findFirst({
    where: {
      id: commentId,
      taskId,
      isDeleted: false,
    },
  });

  if (!comment) {
    throw new AppError(status.NOT_FOUND, "Comment not found");
  }

  const isOwner = comment.authorId === userId;

  const isWorkspaceAuthority =
    membership.role === WorkspaceRole.OWNER ||
    membership.role === WorkspaceRole.ADMIN;

  if (!isOwner && !isWorkspaceAuthority) {
    throw new AppError(
      status.FORBIDDEN,
      "You can only delete your own comments.",
    );
  }

  const deletedComment = await prisma.comment.update({
    where: {
      id: commentId,
    },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });

  return deletedComment;
};

export const commentService = {
  getTaskComments,
  getCommentById,
  createComment,
  updateComment,
  deleteComment,
};
