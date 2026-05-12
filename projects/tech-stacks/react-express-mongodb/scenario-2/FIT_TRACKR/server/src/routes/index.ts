import { Router } from "express";
import authRoutes from "./auth.routes.js";
import workoutRoutes from "./workout.routes.js";
import commentRoutes from "./comment.routes.js";
import userRoutes from "./user.routes.js";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

router.use("/auth", authRoutes);
router.use("/workouts", workoutRoutes);
router.use("/comments", commentRoutes);
router.use("/users", userRoutes);

export default router;
