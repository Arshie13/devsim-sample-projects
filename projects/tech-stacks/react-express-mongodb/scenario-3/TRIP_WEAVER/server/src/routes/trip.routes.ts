import { Router } from "express";
import {
  listTrips,
  getTripBySlug,
  createTrip,
  getTripStats,
  getTimeline,
} from "../controllers/trip.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { createTripSchema, statsQuerySchema } from "../validators/trip.schema.js";

const router = Router();

router.get("/", requireAuth, listTrips);
router.post("/", requireAuth, validateRequest({ body: createTripSchema }), createTrip);
router.get("/:tripId/timeline", requireAuth, getTimeline);

// L3-T2: statsQuerySchema validation is NOT yet wired up (intentional).
// After completing Level 3 Task 2, add:
//   validateRequest({ query: statsQuerySchema }),
// between requireAuth and getTripStats on the line below.
router.get("/:tripId/stats", requireAuth, getTripStats);

router.get("/slug/:slug", requireAuth, getTripBySlug);

export default router;
