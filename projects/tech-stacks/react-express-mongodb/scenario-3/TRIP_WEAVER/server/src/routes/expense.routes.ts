import { Router } from "express";
import { listExpenses, createExpense } from "../controllers/expense.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { createExpenseSchema } from "../validators/expense.schema.js";

const router = Router();

router.get("/:tripId/expenses", requireAuth, listExpenses);
router.post(
  "/:tripId/expenses",
  requireAuth,
  validateRequest({ body: createExpenseSchema }),
  createExpense
);

export default router;
