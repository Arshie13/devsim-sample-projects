import type { Request, Response, NextFunction } from "express";
import { Expense } from "../models/Expense.js";
import { Trip } from "../models/Trip.js";

export async function listExpenses(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { tripId } = req.params;
    const expenses = await Expense.find({ tripId }).sort({ paidAt: -1 });
    res.json({ success: true, data: expenses });
  } catch (err) {
    next(err);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// L4-T2 BUG (intentional): createExpense is not implemented.
// It returns a hardcoded placeholder response.
//
// Fix:
//   1. Load the trip: const trip = await Trip.findById(tripId);
//   2. Validate trip exists (404 if not)
//   3. Validate every userId in splitBetween is [trip.ownerId, ...trip.collaboratorIds]
//      → return 400 if any non-member found
//   4. Create the Expense document
//   5. Increment Trip.totalSpent atomically: $inc: { totalSpent: amount }
//   6. Compute per-member share: Math.round(amount * 100 / splitBetween.length) / 100
//   7. Build balances array: { userId, net }[]
//      net = (userId === paidById ? amount : 0) - share
//   8. Return 201: { success: true, data: { expense, balances } }
// ─────────────────────────────────────────────────────────────────────────────
export async function createExpense(req: Request, res: Response, next: NextFunction): Promise<void> {
  // L4-T2 BUG (intentional): not implemented — replace this with the real logic
  res.json({ ok: true });
}
