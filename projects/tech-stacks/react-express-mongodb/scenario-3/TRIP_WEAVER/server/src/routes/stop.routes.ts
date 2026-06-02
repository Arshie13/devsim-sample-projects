import { Router } from "express";
import { listStops, createStop, vote, unvote } from "../controllers/stop.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { createStopSchema, stopParamsSchema } from "../validators/stop.schema.js";

const router = Router();

router.get("/:tripId/stops", requireAuth, listStops);
router.post(
  "/:tripId/stops",
  requireAuth,
  validateRequest({ body: createStopSchema }),
  createStop
);
router.post("/:tripId/stops/:stopId/vote", requireAuth, vote);
router.delete("/:tripId/stops/:stopId/vote", requireAuth, unvote);

export default router;
