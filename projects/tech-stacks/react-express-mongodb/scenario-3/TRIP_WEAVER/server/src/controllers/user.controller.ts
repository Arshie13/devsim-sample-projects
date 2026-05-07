import type { Request, Response, NextFunction } from "express";
import { User } from "../models/User.js";

export async function getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await User.findById(req.params.userId).select("-passwordHash");
    if (!user) {
      res.status(404).json({ success: false, error: "User not found" });
      return;
    }
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

export async function getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await User.findById(req.user!.userId).select("-passwordHash");
    if (!user) {
      res.status(404).json({ success: false, error: "User not found" });
      return;
    }
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}
