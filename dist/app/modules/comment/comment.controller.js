import status from "http-status";
import catchAsync from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { commentService } from "./comment.service";
const getTaskComments = catchAsync(async (req, res) => {
    const { workspaceId, taskId } = req.params;
    const { userId } = req.user;
    const result = await commentService.getTaskComments(workspaceId, taskId, userId);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Comments retrieved successfully.",
        data: result,
    });
});
const getCommentById = catchAsync(async (req, res) => {
    const { workspaceId, taskId, commentId } = req.params;
    const { userId } = req.user;
    const result = await commentService.getCommentById(workspaceId, taskId, commentId, userId);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Comment retrieved successfully.",
        data: result,
    });
});
const createComment = catchAsync(async (req, res) => {
    const { workspaceId, taskId } = req.params;
    const { userId } = req.user;
    const result = await commentService.createComment(workspaceId, taskId, req.body, userId);
    sendResponse(res, {
        httpStatusCode: status.CREATED,
        success: true,
        message: "Comment created successfully.",
        data: result,
    });
});
const updateComment = catchAsync(async (req, res) => {
    const { workspaceId, taskId, commentId } = req.params;
    const { userId } = req.user;
    const result = await commentService.updateComment(workspaceId, taskId, commentId, req.body, userId);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Comment updated successfully.",
        data: result,
    });
});
const deleteComment = catchAsync(async (req, res) => {
    const { workspaceId, taskId, commentId } = req.params;
    const { userId } = req.user;
    const result = await commentService.deleteComment(workspaceId, taskId, commentId, userId);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Comment deleted successfully.",
        data: result,
    });
});
export const commentController = {
    getTaskComments,
    getCommentById,
    createComment,
    updateComment,
    deleteComment,
};
