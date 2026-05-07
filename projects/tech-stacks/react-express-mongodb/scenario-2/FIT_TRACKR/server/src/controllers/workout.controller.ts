import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { Workout } from "../models/Workout.js";
import { Cheer } from "../models/Cheer.js";
import { User } from "../models/User.js";
import { HttpError } from "../middleware/errorHandler.js";
import { slugify } from "../utils/slug.js";

// COMPLETE — list all workouts (newest first)
export async function list(_req: Request, res: Response, next: NextFunction) {
  try {
    const workouts = await Workout.find()
      .sort({ performedAt: -1 })
      .populate("authorId", "username name avatarUrl role")
      .lean();

    const data = workouts.map((w: any) => ({
      ...w,
      author: w.authorId,
      authorId: w.authorId?._id ?? w.authorId,
    }));

    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

// COMPLETE — get a single workout by id
export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) throw new HttpError(400, "Invalid workout id");

    const workout = await Workout.findById(id)
      .populate("authorId", "username name avatarUrl role")
      .lean();
    if (!workout) throw new HttpError(404, "Workout not found");

    res.status(200).json({ success: true, data: workout });
  } catch (err) {
    next(err);
  }
}

// COMPLETE — create a workout (authenticated)
export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new HttpError(401, "Authentication required");

    const { title, category, exercises, notes, tags, performedAt, durationMin } = req.body;
    const baseSlug = slugify(title);
    const slug = `${baseSlug}-${Date.now().toString(36)}`;

    const workout = await Workout.create({
      title,
      slug,
      category,
      exercises,
      notes,
      tags,
      performedAt: performedAt ? new Date(performedAt) : new Date(),
      durationMin,
      authorId: req.user.userId,
    });

    res.status(201).json({ success: true, data: workout });
  } catch (err) {
    next(err);
  }
}

// L3-T1 BUG (intentional):
//   1. $lookup runs BEFORE $match — entire workouts collection is joined with cheers
//      before filtering by performedAt, making this O(N) regardless of the date range.
//   2. Date filter uses `new Date()` as the start boundary (no 7-day subtraction),
//      so the $match will never find any documents (nothing performed in the future).
//   3. $group sums `$cheers` (wrong field — should be `$cheerCount`),
//      so totalCheers is always 0 when the bug is active.
//   4. No $sort stage, so results arrive in arbitrary order.
//   5. No $limit stage, so the full result set can be returned.
//   6. The raw `workouts` array from the $lookup is included in each response doc.
//
// L3-T2 BUG (intentional, same function):
//   - Not strongly typed (req/res typed as `any`, no NextFunction).
//   - No try/catch — unhandled errors crash the process.
//   - Returns res.send(data) with no status code and no { success, data } envelope.
//   - Does not validate the ?limit query parameter.
//
// Students must rewrite this function in Level 3.
export async function getLeaderboard(req: any, res: any) {
  const sevenDaysAgo = new Date();

  const leaderboard = await Workout.aggregate([
    {
      $lookup: {
        from: "cheers",
        localField: "_id",
        foreignField: "workoutId",
        as: "workouts",
      },
    },
    { $match: { performedAt: { $gte: sevenDaysAgo } } },
    {
      $group: {
        _id: "$authorId",
        totalCheers: { $sum: "$cheers" },
        workoutCount: { $sum: 1 },
      },
    },
  ]);

  res.send(leaderboard);
}

// L4-T1 BUG (intentional): not implemented yet.
// Students must implement an authenticated upsert-style cheer endpoint:
//   - Creates a Cheer document for (userId, workoutId) if one does not exist
//   - Returns 201 on first cheer, 200 on idempotent re-cheer
//   - Increments workout.cheerCount by exactly 1 on first cheer only
//   - Returns { success: true, data: { cheered: true, cheerCount } }
export async function cheer(_req: Request, _res: Response, next: NextFunction) {
  next(new HttpError(501, "cheer: not implemented yet (Level 4 task 1)"));
}

// L4-T1 BUG (intentional): not implemented yet.
// Students must implement an authenticated DELETE that removes the Cheer document
// for (userId, workoutId) and decrements workout.cheerCount, clamped at 0.
// Returns { success: true, data: { cheered: false, cheerCount } }
export async function uncheer(_req: Request, _res: Response, next: NextFunction) {
  next(new HttpError(501, "uncheer: not implemented yet (Level 4 task 1)"));
}

// Helper used by Profile page — complete.
export async function listByAuthor(req: Request, res: Response, next: NextFunction) {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (!user) throw new HttpError(404, "User not found");

    const workouts = await Workout.find({ authorId: user._id }).sort({ performedAt: -1 }).lean();
    res.status(200).json({ success: true, data: workouts });
  } catch (err) {
    next(err);
  }
}
