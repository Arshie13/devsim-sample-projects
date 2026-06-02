import { Router } from "express";
import { register, login } from "../controllers/auth.controller.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { registerSchema, loginSchema } from "../validators/auth.schema.js";

const router = Router();

router.post("/register", validateRequest({ body: registerSchema }), register);
router.post("/login", validateRequest({ body: loginSchema }), login);

export default router;
