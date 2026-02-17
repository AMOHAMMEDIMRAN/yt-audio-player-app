import { AppError } from "../utils/appError";
import type { Request, Response, NextFunction } from "express";

export const globalErrorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = 500;
  let message = "The internal server error";

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  if (typeof err == "object" && err !== null && "issue" in err) {
    return res.status(400).json({
      status: "fail",
      message: "Validation Error",
      errors: (err as any).issues,
    });
  }
  console.error("Full error message: "+err);
  return res.status(statusCode).json({
    status: "error",
    message,
  })
};
