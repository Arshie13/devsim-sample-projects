import { Router } from "express";
import { getProfile, getMyStreak } from "../controllers/user.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Static routes before parameterized ones
router.get("/me/streak", requireAuth, getMyStreak);
router.get("/:username", getProfile);

export default router;
