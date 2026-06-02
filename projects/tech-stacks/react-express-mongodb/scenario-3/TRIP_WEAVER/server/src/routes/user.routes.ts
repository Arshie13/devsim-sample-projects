import { Router } from "express";
import { getProfile, getMe } from "../controllers/user.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/me", requireAuth, getMe);
router.get("/:userId", getProfile);

export default router;
