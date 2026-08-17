import { Router } from "express";
import { authController } from "./auth.controller";
import { validateRequest } from "../../middleware/validateRequest";
import {
  forgotPasswordSchema,
  userLoginZodSchema,
  userRegisterZodSchema,
} from "./auth.validation";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post(
  "/register",
  validateRequest(userRegisterZodSchema),
  authController.registerUser,
);
router.post(
  "/login",
  validateRequest(userLoginZodSchema),
  authController.loginUser,
);

router.get(
  "/my-profile",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  authController.getMyProfile,
);

router.patch(
  "/update-my-profile",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  authController.updateMyProfile,
);

router.post("/refresh-token", authController.getNewToken);
router.post("/logout", authController.logoutUser);

router.post(
  "/change-password",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  authController.changePassword,
);

router.post(
  "/forget-password",
  validateRequest(forgotPasswordSchema),
  authController.forgetPassword,
);
router.post("/reset-password", authController.resetPassword);

export const authRoutes = router;
