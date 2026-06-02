import { Router } from "express";
import authRoutes from "./auth.routes.js";
import recipeRoutes from "./recipe.routes.js";
import userRoutes from "./user.routes.js";
import commentRoutes from "./comment.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/recipes", recipeRoutes);
router.use("/users", userRoutes);
router.use("/comments", commentRoutes);

router.get("/health", (_req, res) => {
  res.status(200).json({ success: true, data: { status: "ok" } });
});

export default router;
