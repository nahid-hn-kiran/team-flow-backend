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
    httpStatusCode: status.OK,
    success: true,
    message: "Workspaces retrived successfully.",
    data: result,
  });
});

const getWorkspaceById = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const { workspaceId } = req.params;
  const result = await workspaceService.getWorkspaceById(
    workspaceId as string,
    userId,
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Workspace retrived successfully.",
    data: result,
  });
});

const updateWorkspace = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const { workspaceId } = req.params;
  const result = await workspaceService.updateWorkspace(
    workspaceId as string,
    userId,
    req.body,
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Workspace updated successfully.",
    data: result,
  });
});

const deleteWorkspace = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const { workspaceId } = req.params;
  const result = await workspaceService.deleteWorkspace(
    workspaceId as string,
    userId,
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Workspace deleted successfully.",
    data: result,
  });
});

const addMember = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const { workspaceId } = req.params;
  const result = await workspaceService.addMember(
    workspaceId as string,
    userId,
    req.body,
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Member added successfully.",
    data: result,
  });
});

const getWorkspaceMembers = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const { workspaceId } = req.params;
  const result = await workspaceService.getWorkspaceMembers(
    workspaceId as string,
    userId,
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Members retrived successfully.",
    data: result,
  });
});

export const workspaceController = {
  createWorkspace,
  getMyWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
  addMember,
  getWorkspaceMembers,
};
