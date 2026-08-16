import { Router } from "express";
import { workspaceController } from "./workspace.controller";
import { validateRequest } from "../../middleware/validateRequest";
import {
  addWorkspaceMemberZodSchema,
  workspaceCreateZodSchema,
  workspaceUpdateZodSchema,
} from "./workspace.validation";
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
  validateRequest(workspaceUpdateZodSchema),
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

router.get(
  "/:workspaceId/member",
  checkAuth(Role.USER),
  workspaceController.getWorkspaceMembers,
);

router.patch(
  "/:workspaceId/member",
  validateRequest(addWorkspaceMemberZodSchema),
  checkAuth(Role.USER),
  workspaceController.addMember,
);

export const workspaceRoutes = router;
