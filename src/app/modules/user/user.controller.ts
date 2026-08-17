import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { userService } from "./user.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  const result = await userService.createAdmin(payload);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Admin registered successfully",
    data: result,
  });
});

const createSuperAdmin = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  const result = await userService.createSuperAdmin(payload);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Super Admin registered successfully",
    data: result,
  });
});

export const userController = {
  createAdmin,
  createSuperAdmin,
};
