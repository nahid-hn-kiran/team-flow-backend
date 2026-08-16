import { Router } from "express";
import { projectController } from "./project.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import {
  createProjectZodSchema,
  updateProjectZodSchema,
} from "./project.validation";

const router = Router();

router.post(
  "/:workspaceId/projects",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(createProjectZodSchema),
  projectController.createProject,
);

router.get(
  "/:workspaceId/projects",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  projectController.getWorkspaceProjects,
);

router.get(
  "/:workspaceId/projects/:projectId",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  projectController.getProjectById,
);

router.patch(
  "/:workspaceId/projects/:projectId",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(updateProjectZodSchema),
  projectController.updateProject,
);

router.patch(
  "/:workspaceId/projects/:projectId/delete",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  projectController.deleteProject,
);

export const projectRoutes = router;
