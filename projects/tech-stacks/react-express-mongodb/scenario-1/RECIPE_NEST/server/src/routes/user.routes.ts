import { Router } from "express";
import { getProfile, follow, unfollow } from "../controllers/user.controller.js";
import { listByAuthor } from "../controllers/recipe.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/:username", getProfile);
router.get("/:username/recipes", listByAuthor);
router.post("/:id/follow", requireAuth, follow);
router.delete("/:id/follow", requireAuth, unfollow);

export default router;
