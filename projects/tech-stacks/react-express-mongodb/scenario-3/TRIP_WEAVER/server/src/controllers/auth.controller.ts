import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { env } from "../env.js";

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { name, username, email, password } = req.body;
    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      res.status(409).json({ success: false, error: "Email or username already in use" });
      return;
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, username, email, passwordHash });
    const token = jwt.sign({ userId: user._id.toString(), username: user.username }, env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(201).json({
      success: true,
      data: {
        token,
        user: { id: user._id, name: user.name, username: user.username, email: user.email },
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ success: false, error: "Invalid credentials" });
      return;
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ success: false, error: "Invalid credentials" });
      return;
    }
    const token = jwt.sign({ userId: user._id.toString(), username: user.username }, env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({
      success: true,
      data: {
        token,
        user: { id: user._id, name: user.name, username: user.username, email: user.email },
      },
    });
  } catch (err) {
    next(err);
  }
}
