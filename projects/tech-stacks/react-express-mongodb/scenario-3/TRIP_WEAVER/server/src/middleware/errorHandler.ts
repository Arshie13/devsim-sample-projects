import type { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const status = typeof err?.status === "number" ? err.status : 500;
  const message = err?.message ?? "Internal server error";
  if (status >= 500) {
    console.error("[errorHandler]", err);
  }
  res.status(status).json({ success: false, error: message });
};

export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}
