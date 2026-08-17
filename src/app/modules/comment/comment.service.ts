import status from "http-status";
import { prisma } from "../../../lib/prisma";
import AppError from "../../errorHelpers/appError";
import {
  ICreateCommentPayload,
  IUpdateCommentPayload,
} from "./comment.interface";
import {
  ActivityAction,
  ActivityEntity,
  WorkspaceRole,
} from "../../../generated/prisma/enums";
import { activityService } from "../activity/activity.service";

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
  const { task } = await checkTaskAccess(workspaceId, taskId, userId);

  const result = await prisma.$transaction(async (tx) => {
    const comment = await tx.comment.create({
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

    await activityService.createActivity(
      {
        action: ActivityAction.COMMENT_ADDED,
        entityType: ActivityEntity.COMMENT,
        entityId: comment.id,

        workspaceId,
        projectId: task.projectId,
        taskId: task.id,

        performedBy: userId,

        description: `A comment was added to task "${task.title}".`,
      },
      tx,
    );

    return comment;
  });

  return result;
};

const updateComment = async (
  workspaceId: string,
  taskId: string,
  commentId: string,
  payload: IUpdateCommentPayload,
  userId: string,
) => {
  const { task } = await checkTaskAccess(workspaceId, taskId, userId);
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

  const result = await prisma.$transaction(async (tx) => {
    const updatedComment = await tx.comment.update({
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

    await activityService.createActivity(
      {
        action: ActivityAction.COMMENT_UPDATED,
        entityType: ActivityEntity.COMMENT,
        entityId: commentId,

        workspaceId,
        projectId: task.projectId,
        taskId,

        performedBy: userId,

        description: `A comment on task "${task.title}" was updated.`,
      },
      tx,
    );

    return updatedComment;
  });

  return result;
};

const deleteComment = async (
  workspaceId: string,
  taskId: string,
  commentId: string,
  userId: string,
) => {
  const { task, membership } = await checkTaskAccess(
    workspaceId,
    taskId,
    userId,
  );

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

  const result = await prisma.$transaction(async (tx) => {
    const deletedComment = await tx.comment.update({
      where: {
        id: commentId,
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    await activityService.createActivity(
      {
        action: ActivityAction.COMMENT_DELETED,
        entityType: ActivityEntity.COMMENT,
        entityId: comment.id,

        workspaceId,
        projectId: task.projectId,
        taskId: task.id,

        performedBy: userId,

        description: `A comment was deleted from task "${task.title}".`,
      },
      tx,
    );

    return deletedComment;
  });

  return result;
};

export const commentService = {
  getTaskComments,
  getCommentById,
  createComment,
  updateComment,
  deleteComment,
};
