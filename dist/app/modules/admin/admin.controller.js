import status from "http-status";
import { sendResponse } from "../../shared/sendResponse";
import { AdminService } from "./admin.service";
import catchAsync from "../../shared/catchAsync";
const getAllUsers = catchAsync(async (req, res) => {
    const result = await AdminService.getAllUsers();
    console.log(result);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Users fetched successfully",
        data: result,
    });
});
const getUserById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const user = await AdminService.getUserById(id);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "User fetched successfully",
        data: user,
    });
});
const getAllAdmins = catchAsync(async (req, res) => {
    const result = await AdminService.getAllAdmins();
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Admins fetched successfully",
        data: result,
    });
});
const getAdminById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const admin = await AdminService.getAdminById(id);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Admin fetched successfully",
        data: admin,
    });
});
const updateAdmin = catchAsync(async (req, res) => {
    const { id } = req.params;
    const payload = req.body;
    const updatedAdmin = await AdminService.updateAdmin(id, payload);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Admin updated successfully",
        data: updatedAdmin,
    });
});
const deleteAdmin = catchAsync(async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    const result = await AdminService.deleteAdmin(id, user);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Admin deleted successfully",
        data: result,
    });
});
export const AdminController = {
    getAllUsers,
    getUserById,
    getAllAdmins,
    updateAdmin,
    deleteAdmin,
    getAdminById,
};
