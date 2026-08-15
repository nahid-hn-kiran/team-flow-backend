import { Router } from "express";
import { authController } from "./auth.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { userLoginZodSchema, userRegisterZodSchema } from "./auth.validation";

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

export const authRoutes = router;
