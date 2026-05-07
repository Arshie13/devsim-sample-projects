import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { env } from "../env.js";
import { HttpError } from "../middleware/errorHandler.js";

function signToken(userId: string, username: string): string {
  return jwt.sign({ userId, username }, env.JWT_SECRET, { expiresIn: "7d" });
}

export async function signup(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, username, email, password } = req.body;

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) throw new HttpError(409, "Username or email already taken");

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, username, email, passwordHash });

    const token = signToken(String(user._id), user.username);
    res.status(201).json({
      success: true,
      data: {
        token,
        user: { _id: user._id, name: user.name, username: user.username, email: user.email },
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { emailOrUsername, password } = req.body;
    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });
    if (!user) throw new HttpError(401, "Invalid credentials");

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new HttpError(401, "Invalid credentials");

    const token = signToken(String(user._id), user.username);
    res.status(200).json({
      success: true,
      data: {
        token,
        user: { _id: user._id, name: user.name, username: user.username, email: user.email },
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function me(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new HttpError(401, "Authentication required");
    const user = await User.findById(req.user.userId).select("-passwordHash");
    if (!user) throw new HttpError(404, "User not found");
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}
