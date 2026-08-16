import { Request, Response } from "express";
import status from "http-status";
import catchAsync from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { projectService } from "./project.service";

const createProject = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;

  const result = await projectService.createProject(
    req.params.workspaceId as string,
    userId,
    req.body,
  );

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Project created successfully.",
    data: result,
  });
});

const getWorkspaceProjects = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;

  const result = await projectService.getWorkspaceProjects(
    req.params.workspaceId as string,
    userId,
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Projects retrieved successfully.",
    data: result,
  });
});

const getProjectById = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;

  const result = await projectService.getProjectById(
    req.params.workspaceId as string,
    req.params.projectId as string,
    userId,
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Project retrieved successfully.",
    data: result,
  });
});

const updateProject = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;

  const result = await projectService.updateProject(
    req.params.workspaceId as string,
    req.params.projectId as string,
    userId,
    req.body,
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Project updated successfully.",
    data: result,
  });
});

const deleteProject = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;

  await projectService.deleteProject(
    req.params.workspaceId as string,
    req.params.projectId as string,
    userId,
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Project deleted successfully.",
    data: null,
  });
});

export const projectController = {
  createProject,
  getWorkspaceProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
