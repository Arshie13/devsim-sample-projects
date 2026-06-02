import { Router } from "express";
import authRoutes from "./auth.routes.js";
import tripRoutes from "./trip.routes.js";
import stopRoutes from "./stop.routes.js";
import expenseRoutes from "./expense.routes.js";
import commentRoutes from "./comment.routes.js";
import userRoutes from "./user.routes.js";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

router.use("/auth", authRoutes);
router.use("/trips", tripRoutes);
router.use("/trips", stopRoutes);
router.use("/trips", expenseRoutes);
router.use("/comments", commentRoutes);
router.use("/users", userRoutes);

export default router;
