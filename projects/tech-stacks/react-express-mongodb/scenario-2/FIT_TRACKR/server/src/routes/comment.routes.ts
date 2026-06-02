import { Router } from "express";
import { list, create } from "../controllers/comment.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { createCommentSchema } from "../validators/comment.schema.js";

const router = Router();

router.get("/", list);
router.post("/", requireAuth, validateRequest({ body: createCommentSchema }), create);

export default router;
