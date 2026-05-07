import { Router } from "express";
import { listComments, postComment } from "../controllers/comment.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { createCommentSchema } from "../validators/comment.schema.js";
import { recipeIdParamSchema } from "../validators/recipe.schema.js";

const router = Router();

router.get("/:id", validateRequest({ params: recipeIdParamSchema }), listComments);
router.post(
  "/:id",
  requireAuth,
  validateRequest({ params: recipeIdParamSchema, body: createCommentSchema }),
  postComment,
);

export default router;
