import type { Request, Response, NextFunction } from "express";
import { Trip } from "../models/Trip.js";
import { Stop } from "../models/Stop.js";
import { Expense } from "../models/Expense.js";
import { slugify } from "../utils/slug.js";
import mongoose from "mongoose";

export async function listTrips(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;
    const trips = await Trip.find({
      $or: [
        { ownerId: userId },
        { collaboratorIds: userId },
      ],
    }).sort({ startDate: -1 });
    res.json({ success: true, data: trips });
  } catch (err) {
    next(err);
  }
}

export async function getTripBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const trip = await Trip.findOne({ slug: req.params.slug })
      .populate("ownerId", "name username avatarUrl")
      .populate("collaboratorIds", "name username avatarUrl");
    if (!trip) {
      res.status(404).json({ success: false, error: "Trip not found" });
      return;
    }
    res.json({ success: true, data: trip });
  } catch (err) {
    next(err);
  }
}

export async function createTrip(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { title, destination, destinationTimezone, startDate, endDate, budget, currency, collaboratorIds, notes, coverUrl } = req.body;
    const slug = slugify(`${title}-${Date.now()}`);
    const trip = await Trip.create({
      title,
      slug,
      ownerId: req.user!.userId,
      collaboratorIds: collaboratorIds ?? [],
      destination,
      destinationTimezone: destinationTimezone ?? "UTC",
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      budget: budget ?? 0,
      currency: currency ?? "USD",
      notes: notes ?? "",
      coverUrl: coverUrl ?? "",
    });
    res.status(201).json({ success: true, data: trip });
  } catch (err) {
    next(err);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// L3-T1 BUG (intentional): getTripStats has 4 bugs in the aggregation pipeline
//
// Bug 1: $lookup runs before $match — should filter by tripId first
// Bug 2: date cutoff uses new Date() instead of trip.startDate
// Bug 3: $group accumulator references '$votes' (raw lookup array) not '$voteCount'
// Bug 4: missing $sort and $limit stages — results are unordered and unbounded
//
// L3-T2 BUG (intentional): getTripStats also has endpoint hardening issues
// Bug 5: req and res are typed as `any` instead of Request/Response
// Bug 6: no try/catch — thrown errors crash the request without a response
// Bug 7: uses res.send(data) with no status code and no { success, data } envelope
// Bug 8: no Zod validation — topN query param is not validated
// ─────────────────────────────────────────────────────────────────────────────
export async function getTripStats(req: any, res: any) {
  const { tripId } = req.params;
  const topN = Number(req.query.topN ?? 5);

  const trip = await Trip.findById(tripId);
  if (!trip) {
    return res.status(404).json({ success: false, error: "Trip not found" });
  }

  // L3-T1 BUG 1: $lookup runs before $match — processes all stops before filtering
  // Fix: move the $match stage to the top of the pipeline
  const topStops = await Stop.aggregate([
    {
      // L3-T1 BUG 1: this $lookup should come AFTER the $match below
      $lookup: {
        from: "votes",
        localField: "_id",
        foreignField: "stopId",
        as: "votes",
      },
    },
    {
      $match: {
        tripId: new mongoose.Types.ObjectId(tripId),
        // L3-T1 BUG 2: should use trip.startDate not new Date()
        dayDate: { $gte: new Date(), $lte: trip.endDate },
      },
    },
    {
      $group: {
        _id: "$_id",
        title: { $first: "$title" },
        dayDate: { $first: "$dayDate" },
        // L3-T1 BUG 3: '$votes' references the lookup array, should be '$voteCount'
        voteCount: { $sum: { $size: "$votes" } },
      },
    },
    // L3-T1 BUG 4: missing $sort and $limit — results are unordered and unbounded
    // Fix: add { $sort: { voteCount: -1 } } and { $limit: topN }
    {
      $project: {
        stopId: "$_id",
        title: 1,
        dayDate: 1,
        voteCount: 1,
        _id: 0,
      },
    },
  ]);

  const expenseResult = await Expense.aggregate([
    { $match: { tripId: new mongoose.Types.ObjectId(tripId) } },
    { $group: { _id: null, totalSpent: { $sum: "$amount" } } },
  ]);

  const totalSpent = expenseResult[0]?.totalSpent ?? 0;

  const data = { topStops, totalSpent };

  // L3-T2 BUG 7: no status code, no { success, data } envelope
  res.send(data);
}

// ─────────────────────────────────────────────────────────────────────────────
// L5-T2 BUG (intentional): getTimeline groups stops by UTC date (toISOString)
// instead of the trip's destinationTimezone local date.
//
// Fix: replace the toISOString().slice(0,10) call with localDateKeyForTrip()
// from server/src/utils/tz.ts, reading trip.destinationTimezone.
// ─────────────────────────────────────────────────────────────────────────────
export async function getTimeline(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { tripId } = req.params;
    const trip = await Trip.findById(tripId);
    if (!trip) {
      res.status(404).json({ success: false, error: "Trip not found" });
      return;
    }

    const stops = await Stop.find({ tripId }).sort({ dayDate: 1, order: 1 });

    // L5-T2 BUG (intentional): groups by UTC date, ignores trip.destinationTimezone
    // For a Tokyo trip (UTC+9), a stop at 15:30Z is 00:30 local time the NEXT day.
    // This grouping puts it on the UTC date (Apr 12) instead of Tokyo local (Apr 13).
    //
    // Fix: import localDateKeyForTrip from '../utils/tz.js' and use:
    //   const tz = trip.destinationTimezone ?? 'UTC';
    //   const dayKey = localDateKeyForTrip(stop.dayDate, tz);
    const grouped: Record<string, typeof stops> = {};
    for (const stop of stops) {
      const dayKey = stop.dayDate.toISOString().slice(0, 10); // L5-T2 BUG (intentional)
      if (!grouped[dayKey]) grouped[dayKey] = [];
      grouped[dayKey].push(stop);
    }

    const timeline = Object.entries(grouped).map(([day, dayStops]) => ({ day, stops: dayStops }));
    res.json({ success: true, data: timeline });
  } catch (err) {
    next(err);
  }
}
