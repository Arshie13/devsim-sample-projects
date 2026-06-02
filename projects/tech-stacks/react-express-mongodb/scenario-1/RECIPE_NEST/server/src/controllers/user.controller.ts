import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { User } from "../models/User.js";
import { Recipe } from "../models/Recipe.js";
import { HttpError } from "../middleware/errorHandler.js";

export async function getProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username }).select("-passwordHash -email");
    if (!user) throw new HttpError(404, "User not found");

    const recipes = await Recipe.find({ authorId: user._id }).sort({ createdAt: -1 }).lean();

    res.status(200).json({
      success: true,
      data: {
        user,
        recipes,
        followerCount: user.followers?.length ?? 0,
        followingCount: user.following?.length ?? 0,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function follow(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new HttpError(401, "Authentication required");
    const targetId = req.params.id;
    if (!mongoose.isValidObjectId(targetId)) throw new HttpError(400, "Invalid user id");
    if (targetId === req.user.userId) throw new HttpError(400, "Cannot follow yourself");

    await User.updateOne({ _id: targetId }, { $addToSet: { followers: req.user.userId } });
    await User.updateOne({ _id: req.user.userId }, { $addToSet: { following: targetId } });

    res.status(200).json({ success: true, data: { following: true } });
  } catch (err) {
    next(err);
  }
}

export async function unfollow(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new HttpError(401, "Authentication required");
    const targetId = req.params.id;
    if (!mongoose.isValidObjectId(targetId)) throw new HttpError(400, "Invalid user id");

    await User.updateOne({ _id: targetId }, { $pull: { followers: req.user.userId } });
    await User.updateOne({ _id: req.user.userId }, { $pull: { following: targetId } });

    res.status(200).json({ success: true, data: { following: false } });
  } catch (err) {
    next(err);
  }
}
