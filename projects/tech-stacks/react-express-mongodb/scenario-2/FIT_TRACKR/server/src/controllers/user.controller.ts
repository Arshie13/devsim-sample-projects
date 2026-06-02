import type { Request, Response, NextFunction } from "express";
import { User } from "../models/User.js";
import { Workout } from "../models/Workout.js";
import { HttpError } from "../middleware/errorHandler.js";

export async function getProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username }).select("-passwordHash").lean();
    if (!user) throw new HttpError(404, "User not found");

    const workouts = await Workout.find({ authorId: (user as any)._id })
      .sort({ performedAt: -1 })
      .lean();

    res.status(200).json({ success: true, data: { user, workouts } });
  } catch (err) {
    next(err);
  }
}

// L4-T2 BUG (intentional): not implemented yet.
// Students must implement GET /api/users/me/streak that returns
// { currentStreak, longestStreak, lastWorkoutDate } computed from the
// authenticated user's workouts, grouped by the user's local calendar day
// (read from user.timezone — default "UTC").
//
// The naive (buggy) grouping that students start from in Level 5 is:
//   workoutDays = workouts.map(w => w.performedAt.toISOString().slice(0, 10))
// This breaks for users in positive UTC offsets near midnight (L5-T2 bug).
export async function getMyStreak(_req: Request, _res: Response, next: NextFunction) {
  next(new HttpError(501, "getMyStreak: not implemented yet (Level 4 task 2)"));
}
