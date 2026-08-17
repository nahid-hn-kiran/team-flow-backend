import { Router } from "express";
import { activityController } from "./activity.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.get(
  "/:workspaceId",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  activityController.getWorkspaceActivities,
);

router.get(
  "/:workspaceId/tasks/:taskId",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  activityController.getTaskActivities,
);

export const activityRoutes = router;
