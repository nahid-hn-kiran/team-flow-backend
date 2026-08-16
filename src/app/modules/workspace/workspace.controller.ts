import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { workspaceService } from "./workspace.service";

const createWorkspace = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const result = await workspaceService.createWorkspace(req.body, userId);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Workspace created successfully.",
    data: result,
  });
});

const getMyWorkspaces = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const result = await workspaceService.getMyWorkspaces(userId);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Workspaces retrived successfully.",
    data: result,
  });
});

export const workspaceController = {
  createWorkspace,
  getMyWorkspaces,
};
