import type { Request, Response, NextFunction } from "express";
import { Comment } from "../models/Comment.js";

export async function listComments(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { tripId } = req.params;
    const comments = await Comment.find({ tripId })
      .populate("authorId", "name username avatarUrl")
      .sort({ createdAt: 1 });
    res.json({ success: true, data: comments });
  } catch (err) {
    next(err);
  }
}

export async function createComment(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { body, tripId, stopId } = req.body;
    const comment = await Comment.create({
      body,
      tripId: tripId ?? undefined,
      stopId: stopId ?? undefined,
      authorId: req.user!.userId,
    });
    const populated = await comment.populate("authorId", "name username avatarUrl");
    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    next(err);
  }
}
