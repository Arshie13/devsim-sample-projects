import { Router } from "express";
import {
  list,
  getById,
  create,
  getLeaderboard,
  cheer,
  uncheer,
} from "../controllers/workout.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { createWorkoutSchema, workoutIdParamSchema } from "../validators/workout.schema.js";

const router = Router();

// Static routes BEFORE parameterized ones so /leaderboard is not captured by /:id
router.get("/leaderboard", getLeaderboard);

router.get("/", list);
router.post("/", requireAuth, validateRequest({ body: createWorkoutSchema }), create);

router.get("/:id", validateRequest({ params: workoutIdParamSchema }), getById);

router.post("/:id/cheer", requireAuth, validateRequest({ params: workoutIdParamSchema }), cheer);
router.delete("/:id/cheer", requireAuth, validateRequest({ params: workoutIdParamSchema }), uncheer);

export default router;
