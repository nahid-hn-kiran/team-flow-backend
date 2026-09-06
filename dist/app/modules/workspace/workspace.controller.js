import catchAsync from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { workspaceService } from "./workspace.service";
const createWorkspace = catchAsync(async (req, res) => {
    const { userId } = req.user;
    const result = await workspaceService.createWorkspace(req.body, userId);
    sendResponse(res, {
        httpStatusCode: status.CREATED,
        success: true,
        message: "Workspace created successfully.",
        data: result,
    });
});
const getMyWorkspaces = catchAsync(async (req, res) => {
    const { userId } = req.user;
    const result = await workspaceService.getMyWorkspaces(userId);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Workspaces retrived successfully.",
        data: result,
    });
});
const getWorkspaceById = catchAsync(async (req, res) => {
    const { userId } = req.user;
    const { workspaceId } = req.params;
    console.log(workspaceId);
    const result = await workspaceService.getWorkspaceById(workspaceId, userId);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Workspace retrived successfully.",
        data: result,
    });
});
const updateWorkspace = catchAsync(async (req, res) => {
    const { userId } = req.user;
    const { workspaceId } = req.params;
    const result = await workspaceService.updateWorkspace(workspaceId, userId, req.body);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Workspace updated successfully.",
        data: result,
    });
});
const deleteWorkspace = catchAsync(async (req, res) => {
    const { userId } = req.user;
    const { workspaceId } = req.params;
    const result = await workspaceService.deleteWorkspace(workspaceId, userId);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Workspace deleted successfully.",
        data: result,
    });
});
const addMember = catchAsync(async (req, res) => {
    const { userId } = req.user;
    const { workspaceId } = req.params;
    const result = await workspaceService.addMember(workspaceId, userId, req.body);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Member added successfully.",
        data: result,
    });
});
const getWorkspaceMembers = catchAsync(async (req, res) => {
    const { userId } = req.user;
    const { workspaceId } = req.params;
    const result = await workspaceService.getWorkspaceMembers(workspaceId, userId);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Members retrived successfully.",
        data: result,
    });
});
const getWorkspaceMember = catchAsync(async (req, res) => {
    const { userId } = req.user;
    const { workspaceId } = req.params;
    const { memberId } = req.params;
    const result = await workspaceService.getWorkspaceMember(workspaceId, userId, memberId);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Member retrived successfully.",
        data: result,
    });
});
const updateMemberRole = catchAsync(async (req, res) => {
    const { userId } = req.user;
    const { workspaceId } = req.params;
    const { memberId } = req.params;
    const result = await workspaceService.updateMemberRole(workspaceId, userId, memberId, req.body);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Member role updated successfully.",
        data: result,
    });
});
const removeMember = catchAsync(async (req, res) => {
    const { userId } = req.user;
    const { workspaceId } = req.params;
    const { memberId } = req.params;
    await workspaceService.removeMember(workspaceId, userId, memberId);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Member removed successfully.",
        data: null,
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
    getWorkspaceMember,
    updateMemberRole,
    removeMember,
};
