import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.route";
import { workspaceRoutes } from "../modules/workspace/workspace.route";
import { projectRoutes } from "../modules/project/project.route";
import { taskRoutes } from "../modules/task/task.route";

const router = Router();

router.use("/auth", authRoutes);
router.use("/workspaces", workspaceRoutes);
router.use("/projects", projectRoutes);
router.use("/tasks", taskRoutes);

export const indexRoutes = router;
