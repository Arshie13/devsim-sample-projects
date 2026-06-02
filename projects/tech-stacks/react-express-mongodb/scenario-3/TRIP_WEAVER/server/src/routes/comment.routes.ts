import { Router } from "express";
import { listComments, createComment } from "../controllers/comment.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { createCommentSchema } from "../validators/comment.schema.js";

const router = Router();

router.get("/trip/:tripId", listComments);
router.post("/", requireAuth, validateRequest({ body: createCommentSchema }), createComment);

export default router;
