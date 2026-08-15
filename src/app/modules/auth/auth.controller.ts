import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const result = await authService.registerUser({ name, email, password });

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Registration successfull",
    data: result,
  });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const result = await authService.loginUser({ email, password });

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Login successfull",
    data: result,
  });
});

export const authController = {
  registerUser,
  loginUser,
};
