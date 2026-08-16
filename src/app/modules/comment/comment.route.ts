import { Router } from "express";
import { commentController } from "./comment.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import {
  createCommentZodSchema,
  updateCommentZodSchema,
} from "./comment.validation";

const router = Router();

router.post(
  "/:workspaceId/projects/:projectId/tasks/:taskId/comments",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(createCommentZodSchema),
  commentController.createComment,
);

router.get(
  "/:workspaceId/projects/:projectId/tasks/:taskId/comments",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  commentController.getTaskComments,
);

router.get(
  "/:workspaceId/projects/:projectId/tasks/:taskId/comments/:commentId",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  commentController.getCommentById,
);

router.patch(
  "/:workspaceId/projects/:projectId/tasks/:taskId/comments/:commentId",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(updateCommentZodSchema),
  commentController.updateComment,
);

router.patch(
  "/:workspaceId/projects/:projectId/tasks/:taskId/comments/:commentId/delete",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  commentController.deleteComment,
);

export const commentRoutes = router;
