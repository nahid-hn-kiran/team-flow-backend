import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.route";
import { workspaceRoutes } from "../modules/workspace/workspace.route";
import { projectRoutes } from "../modules/project/project.route";
import { taskRoutes } from "../modules/task/task.route";
import { commentRoutes } from "../modules/comment/comment.route";
import { activityRoutes } from "../modules/activity/activity.route";
import { userRoutes } from "../modules/user/user.route";

const router = Router();

router.use("/auth", authRoutes);
router.use("/workspaces", workspaceRoutes);
router.use("/projects", projectRoutes);
router.use("/tasks", taskRoutes);
router.use("/comments", commentRoutes);
router.use("/activities", activityRoutes);
router.use("/user", userRoutes);

export const indexRoutes = router;
