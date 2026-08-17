import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest";
import { createAdminZodSchema } from "./user.validation";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { userController } from "./user.controller";

const router = Router();

router.post(
  "/create-admin",
  validateRequest(createAdminZodSchema),
  checkAuth(Role.SUPER_ADMIN),
  userController.createAdmin,
);

router.post(
  "/create-super-admin",
  validateRequest(createAdminZodSchema),
  checkAuth(Role.SUPER_ADMIN),
  userController.createSuperAdmin,
);

export const userRoutes = router;
