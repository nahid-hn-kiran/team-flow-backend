import z from "zod";
import { IErrorResposne, IErrorSources } from "../interfaces/error.interface";
import status from "http-status";

export const handleZodError = (err: z.ZodError): IErrorResposne => {
  const statusCode = status.BAD_REQUEST;
  const message = "Zod validation error";
  const errorSource: IErrorSources[] = [];

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
