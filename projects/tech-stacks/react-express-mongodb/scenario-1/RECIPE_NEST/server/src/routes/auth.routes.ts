import { Router } from "express";
import { signup, login, me } from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { signupSchema, loginSchema } from "../validators/auth.schema.js";

const router = Router();

router.post("/signup", validateRequest({ body: signupSchema }), signup);
router.post("/login", validateRequest({ body: loginSchema }), login);
router.get("/me", requireAuth, me);

export default router;
