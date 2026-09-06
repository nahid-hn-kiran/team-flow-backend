import { envVars } from "../config/env";
import status from "http-status";
import z from "zod";
import { handleZodError } from "../errorHelpers/handleZodError";
import AppError from "../errorHelpers/appError";
export const globalErrorHandler = async (
// eslint-disable-next-line @typescript-eslint/no-explicit-any
err, req, res, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
next) => {
    if (envVars.NODE_ENV === "development") {
        console.log("Error from Global Error Handler ", err);
    }
    let errorSource = [];
    let statusCode = status.INTERNAL_SERVER_ERROR;
    let message = "Internal server error";
    let stack = undefined;
    if (err instanceof z.ZodError) {
        const simplifiedError = handleZodError(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSource.push(...simplifiedError.errorSource);
        stack = err.stack;
    }
    else if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
        stack = err.stack;
        errorSource = [
            {
                path: "",
                message: err.message,
            },
        ];
    }
    else if (err instanceof Error) {
        statusCode = status.INTERNAL_SERVER_ERROR;
        message = err.message;
        stack = err.stack;
        errorSource = [
            {
                path: "",
                message: err.message,
            },
        ];
    }
    const errorResponse = {
        success: false,
        message: message,
        errorSource,
        error: envVars.NODE_ENV === "development" ? err : undefined,
        stack: envVars.NODE_ENV === "development" ? stack : undefined,
    };
    res.status(statusCode).json(errorResponse);
};
