import { Request, Response } from "express";
import status from "http-status";
import catchAsync from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { taskService } from "./task.service";

const createTask = catchAsync(async (req: Request, res: Response) => {
  const { workspaceId, projectId } = req.params;
  const { userId } = req.user;

  const result = await taskService.createTask(
    workspaceId as string,
    projectId as string,
    req.body,
    userId,
  );

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Task created successfully.",
    data: result,
  });
});

const getProjectTasks = catchAsync(async (req: Request, res: Response) => {
  const { workspaceId, projectId } = req.params;
  const { userId } = req.user;

  const result = await taskService.getProjectTasks(
    workspaceId as string,
    projectId as string,
    userId,
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Tasks retrieved successfully.",
    data: result,
  });
});

const getTaskById = catchAsync(async (req: Request, res: Response) => {
  const { workspaceId, projectId, taskId } = req.params;
  const { userId } = req.user;

  const result = await taskService.getTaskById(
    workspaceId as string,
    projectId as string,
    taskId as string,
    userId,
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Task retrieved successfully.",
    data: result,
  });
});

const updateTask = catchAsync(async (req: Request, res: Response) => {
  const { workspaceId, projectId, taskId } = req.params;
  const { userId } = req.user;

  const result = await taskService.updateTask(
    workspaceId as string,
    projectId as string,
    taskId as string,
    req.body,
    userId,
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Task updated successfully.",
    data: result,
  });
});

const updateTaskStatus = catchAsync(async (req: Request, res: Response) => {
  const { workspaceId, projectId, taskId } = req.params;
  const { userId } = req.user;

  const result = await taskService.updateTaskStatus(
    workspaceId as string,
    projectId as string,
    taskId as string,
    req.body,
    userId,
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Task status updated successfully.",
    data: result,
  });
});

const assignTask = catchAsync(async (req: Request, res: Response) => {
  const { workspaceId, projectId, taskId } = req.params;
  const { userId } = req.user;

  const result = await taskService.assignTask(
    workspaceId as string,
    projectId as string,
    taskId as string,
    req.body,
    userId,
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Task assigned successfully.",
    data: result,
  });
});

const deleteTask = catchAsync(async (req: Request, res: Response) => {
  const { workspaceId, projectId, taskId } = req.params;
  const { userId } = req.user;

  const result = await taskService.deleteTask(
    workspaceId as string,
    projectId as string,
    taskId as string,
    userId,
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Task deleted successfully.",
    data: result,
  });
});

export const taskController = {
  createTask,
  getProjectTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
  assignTask,
  deleteTask,
};
