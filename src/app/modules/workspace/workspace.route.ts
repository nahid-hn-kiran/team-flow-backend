import { Router } from "express";
import { workspaceController } from "./workspace.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { workspaceCreateZodSchema } from "./workspace.validation";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.get("/", checkAuth(Role.USER), workspaceController.getMyWorkspaces);
router.get(
  "/:workspaceId",
  checkAuth(Role.USER),
  workspaceController.getWorkspaceById,
);
router.patch(
  "/:workspaceId",
  checkAuth(Role.USER),
  workspaceController.updateWorkspace,
);
router.patch(
  "/delete/:workspaceId",
  checkAuth(Role.USER),
  workspaceController.deleteWorkspace,
);
router.post(
  "/",
  validateRequest(workspaceCreateZodSchema),
  checkAuth(Role.USER),
  workspaceController.createWorkspace,
);

export const workspaceRoutes = router;
