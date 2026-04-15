import type { NextFunction, Request, Response } from "express";
import type { ApiResponse } from "../types/api.js";

export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof AppError) {
    const response: ApiResponse = {
      success: false,
      error: err.message,
    };

    return res.status(err.statusCode).json(response);
  }

  console.error("Unexpected error:", err);

  const response: ApiResponse = {
    success: false,
    error: "Internal server error.",
  };

  return res.status(500).json(response);
};
