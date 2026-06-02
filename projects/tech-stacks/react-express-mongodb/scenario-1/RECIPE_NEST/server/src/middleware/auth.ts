import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../env.js";

export interface AuthPayload {
  userId: string;
  username: string;
}

declare module "express-serve-static-core" {
  interface Request {
    user?: AuthPayload;
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";

  if (!token) {
    return res.status(401).json({ success: false, error: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as AuthPayload;
    req.user = { userId: decoded.userId, username: decoded.username };
    next();
  } catch {
    return res.status(401).json({ success: false, error: "Invalid or expired token" });
  }
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";

  if (token) {
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as AuthPayload;
      req.user = { userId: decoded.userId, username: decoded.username };
    } catch {
      // ignore — optional auth
    }
  }
  next();
}
