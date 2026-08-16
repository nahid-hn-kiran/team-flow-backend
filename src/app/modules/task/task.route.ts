import { Router } from "express";
import { taskController } from "./task.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { Role } from "../../../generated/prisma/enums";
import {
  assignTaskZodSchema,
  createTaskZodSchema,
  updateTaskStatusZodSchema,
  updateTaskZodSchema,
} from "./task.validation";

const router = Router();

const allowedRoles = [Role.USER, Role.ADMIN, Role.SUPER_ADMIN];

router.post(
  "/:workspaceId/projects/:projectId/tasks",
  checkAuth(...allowedRoles),
  validateRequest(createTaskZodSchema),
  taskController.createTask,
);

router.get(
  "/:workspaceId/projects/:projectId/tasks",
  checkAuth(...allowedRoles),
  taskController.getProjectTasks,
);

router.get(
  "/:workspaceId/projects/:projectId/tasks/:taskId",
  checkAuth(...allowedRoles),
  taskController.getTaskById,
);

router.patch(
  "/:workspaceId/projects/:projectId/tasks/:taskId",
  checkAuth(...allowedRoles),
  validateRequest(updateTaskZodSchema),
  taskController.updateTask,
);

router.patch(
  "/:workspaceId/projects/:projectId/tasks/:taskId/status",
  checkAuth(...allowedRoles),
  validateRequest(updateTaskStatusZodSchema),
  taskController.updateTaskStatus,
);

router.patch(
  "/:workspaceId/projects/:projectId/tasks/:taskId/assign",
  checkAuth(...allowedRoles),
  validateRequest(assignTaskZodSchema),
  taskController.assignTask,
);

router.patch(
  "/:workspaceId/projects/:projectId/tasks/:taskId/delete",
  checkAuth(...allowedRoles),
  taskController.deleteTask,
);

export const taskRoutes = router;
