import type { Request, Response, NextFunction } from "express";
import { Comment } from "../models/Comment.js";
import { Workout } from "../models/Workout.js";
import { HttpError } from "../middleware/errorHandler.js";

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const { workoutId } = req.query as { workoutId?: string };
    if (!workoutId) throw new HttpError(400, "workoutId query parameter is required");

    const comments = await Comment.find({ workoutId })
      .sort({ createdAt: 1 })
      .populate("authorId", "username avatarUrl")
      .lean();

    const data = comments.map((c: any) => ({
      ...c,
      author: c.authorId,
      authorId: c.authorId?._id ?? c.authorId,
    }));

    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new HttpError(401, "Authentication required");

    const { workoutId, body } = req.body;
    const workout = await Workout.findById(workoutId);
    if (!workout) throw new HttpError(404, "Workout not found");

    const comment = await Comment.create({ workoutId, authorId: req.user.userId, body });
    await Workout.findByIdAndUpdate(workoutId, { $inc: { commentCount: 1 } });

    const populated = await Comment.findById(comment._id)
      .populate("authorId", "username avatarUrl")
      .lean() as any;

    res.status(201).json({
      success: true,
      data: { ...populated, author: populated.authorId, authorId: populated.authorId?._id },
    });
  } catch (err) {
    next(err);
  }
}
