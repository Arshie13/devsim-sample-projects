import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";

interface Schemas {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

export function validateRequest(schemas: Schemas) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schemas.body) req.body = schemas.body.parse(req.body);
      if (schemas.query) req.query = schemas.query.parse(req.query) as Record<string, unknown>;
      if (schemas.params) req.params = schemas.params.parse(req.params) as Record<string, string>;
      next();
    } catch (err: any) {
      const issues = err?.issues ?? err?.errors ?? [];
      const message = issues[0]?.message ?? "Invalid request";
      res.status(400).json({ success: false, error: message, issues });
    }
  };
}
