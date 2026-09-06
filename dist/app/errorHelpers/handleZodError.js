import status from "http-status";
export const handleZodError = (err) => {
    const statusCode = status.BAD_REQUEST;
    const message = "Zod validation error";
    const errorSource = [];
    err.issues.forEach((issue) => {
        errorSource.push({
            path: issue.path.join(".") || "unknown",
            message: issue.message,
        });
    });
    return {
        statusCode,
        success: false,
        message,
        errorSource,
    };
};
