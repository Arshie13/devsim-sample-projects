import { Router } from "express";
import {
  list,
  getById,
  create,
  getTrending,
  save,
  getSaved,
  unsave,
} from "../controllers/recipe.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { createRecipeSchema, recipeIdParamSchema } from "../validators/recipe.schema.js";

const router = Router();

// Static routes BEFORE parameterized ones so /trending and /saved are not
// captured by /:id.
router.get("/trending", getTrending);
router.get("/saved", requireAuth, getSaved);

router.get("/", list);
router.post("/", requireAuth, validateRequest({ body: createRecipeSchema }), create);

router.get("/:id", validateRequest({ params: recipeIdParamSchema }), getById);

router.post("/:id/save", requireAuth, validateRequest({ params: recipeIdParamSchema }), save);
router.delete("/:id/save", requireAuth, validateRequest({ params: recipeIdParamSchema }), unsave);

export default router;
