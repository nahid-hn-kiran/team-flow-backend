import { Request, Response } from "express";
import status from "http-status";
import catchAsync from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { activityService } from "./activity.service";

const getWorkspaceActivities = catchAsync(
  async (req: Request, res: Response) => {
    const { workspaceId } = req.params;
    const { userId } = req.user;

    const result = await activityService.getWorkspaceActivities(
      workspaceId as string,
      userId,
    );

    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Workspace activities retrieved successfully.",
      data: result,
    });
  },
);

const getTaskActivities = catchAsync(async (req: Request, res: Response) => {
  const { workspaceId, taskId } = req.params;
  const { userId } = req.user;

  const result = await activityService.getTaskActivities(
    workspaceId as string,
    taskId as string,
    userId,
  );

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
