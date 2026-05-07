import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(1).max(80),
  username: z.string().min(3).max(30).regex(/^[a-z0-9_]+$/, "Lowercase letters, numbers, _ only"),
  email: z.string().email(),
  password: z.string().min(8).max(120),
});

export const loginSchema = z.object({
  emailOrUsername: z.string().min(1),
  password: z.string().min(1),
});
