import status from "http-status";
import catchAsync from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { taskService } from "./task.service";
const createTask = catchAsync(async (req, res) => {
    const { workspaceId, projectId } = req.params;
    const { userId } = req.user;
    const result = await taskService.createTask(workspaceId, projectId, req.body, userId);
    sendResponse(res, {
        httpStatusCode: status.CREATED,
        success: true,
        message: "Task created successfully.",
        data: result,
    });
});
const getProjectTasks = catchAsync(async (req, res) => {
    const { workspaceId, projectId } = req.params;
    const { userId } = req.user;
    const result = await taskService.getProjectTasks(workspaceId, projectId, userId);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Tasks retrieved successfully.",
        data: result,
    });
});
const getTaskById = catchAsync(async (req, res) => {
    const { workspaceId, projectId, taskId } = req.params;
    const { userId } = req.user;
    const result = await taskService.getTaskById(workspaceId, projectId, taskId, userId);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Task retrieved successfully.",
        data: result,
    });
});
const updateTask = catchAsync(async (req, res) => {
    const { workspaceId, projectId, taskId } = req.params;
    const { userId } = req.user;
    const result = await taskService.updateTask(workspaceId, projectId, taskId, req.body, userId);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Task updated successfully.",
        data: result,
    });
});
const updateTaskStatus = catchAsync(async (req, res) => {
    const { workspaceId, projectId, taskId } = req.params;
    const { userId } = req.user;
    const result = await taskService.updateTaskStatus(workspaceId, projectId, taskId, req.body, userId);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Task status updated successfully.",
        data: result,
    });
});
const assignTask = catchAsync(async (req, res) => {
    const { workspaceId, projectId, taskId } = req.params;
    const { userId } = req.user;
    const result = await taskService.assignTask(workspaceId, projectId, taskId, req.body, userId);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Task assigned successfully.",
        data: result,
    });
});
const deleteTask = catchAsync(async (req, res) => {
    const { workspaceId, projectId, taskId } = req.params;
    const { userId } = req.user;
    const result = await taskService.deleteTask(workspaceId, projectId, taskId, userId);
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
