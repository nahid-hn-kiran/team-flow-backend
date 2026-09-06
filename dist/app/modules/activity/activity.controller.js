import status from "http-status";
import catchAsync from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { activityService } from "./activity.service";
const getWorkspaceActivities = catchAsync(async (req, res) => {
    const { workspaceId } = req.params;
    const { userId } = req.user;
    const result = await activityService.getWorkspaceActivities(workspaceId, userId);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Workspace activities retrieved successfully.",
        data: result,
    });
});
const getTaskActivities = catchAsync(async (req, res) => {
    const { workspaceId, taskId } = req.params;
    const { userId } = req.user;
    const result = await activityService.getTaskActivities(workspaceId, taskId, userId);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Task activities retrieved successfully.",
        data: result,
    });
});
export const activityController = {
    getWorkspaceActivities,
    getTaskActivities,
};
