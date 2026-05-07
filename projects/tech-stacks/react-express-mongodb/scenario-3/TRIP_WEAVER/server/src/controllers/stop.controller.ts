import type { Request, Response, NextFunction } from "express";
import { Stop } from "../models/Stop.js";
import { Vote } from "../models/Vote.js";
import { Trip } from "../models/Trip.js";
import { HttpError } from "../middleware/errorHandler.js";
import mongoose from "mongoose";

export async function listStops(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { tripId } = req.params;
    const stops = await Stop.find({ tripId }).sort({ dayDate: 1, order: 1 });
    res.json({ success: true, data: stops });
  } catch (err) {
    next(err);
  }
}

export async function createStop(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { tripId } = req.params;
    const { title, category, location, notes, dayDate, order } = req.body;
    const stop = await Stop.create({
      tripId,
      title,
      category: category ?? "activity",
      location: location ?? "",
      notes: notes ?? "",
      dayDate: new Date(dayDate),
      order: order ?? 0,
      suggestedBy: req.user!.userId,
    });
    await Trip.findByIdAndUpdate(tripId, { $inc: { stopCount: 1 } });
    res.status(201).json({ success: true, data: stop });
  } catch (err) {
    next(err);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// L4-T1 BUG (intentional): vote and unvote are not implemented.
// They return 501 Not Implemented.
//
// Fix (vote):
//   1. Find existing Vote: const existing = await Vote.findOne({ stopId, userId });
//   2. If exists, return 200 (idempotent — already voted)
//   3. If not, create Vote and increment voteCount atomically:
//      await Vote.create({ stopId, userId });
//      await Stop.findByIdAndUpdate(stopId, { $inc: { voteCount: 1 } });
//      return 201
//
// Fix (unvote):
//   1. Delete the Vote doc if it exists
//   2. Decrement voteCount (only if a doc was deleted, use $inc: { voteCount: -1 })
// ─────────────────────────────────────────────────────────────────────────────
export async function vote(req: Request, res: Response, next: NextFunction): Promise<void> {
  // L4-T1 BUG (intentional): not implemented
  next(new HttpError(501, "vote is not implemented yet — complete Level 4 Task 1"));
}

export async function unvote(req: Request, res: Response, next: NextFunction): Promise<void> {
  // L4-T1 BUG (intentional): not implemented
  next(new HttpError(501, "unvote is not implemented yet — complete Level 4 Task 1"));
}
