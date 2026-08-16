import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.route";
import { workspaceRoutes } from "../modules/workspace/workspace.route";

const router = Router();

router.use("/auth", authRoutes);
router.use("/workspace", workspaceRoutes);

export const indexRoutes = router;
