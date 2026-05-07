import { z } from "zod";

const exerciseSchema = z.object({
  name: z.string().min(1),
  sets: z.number().int().min(1).default(1),
  reps: z.number().int().min(0).default(0),
  weightKg: z.number().min(0).default(0),
  durationSec: z.number().int().min(0).default(0),
});

export const createWorkoutSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  category: z.enum(["strength", "cardio", "mobility", "hiit"]),
  exercises: z.array(exerciseSchema).default([]),
  notes: z.string().max(5000).default(""),
  tags: z.array(z.string()).default([]),
  performedAt: z.string().datetime().optional(),
  durationMin: z.number().int().min(0).default(0),
});

export const workoutIdParamSchema = z.object({
  id: z.string().length(24, "Invalid workout id"),
});

export const leaderboardQuerySchema = z.object({
  limit: z
    .string()
    .optional()
    .transform((v) => (v === undefined ? 10 : Number(v)))
    .pipe(z.number().int().min(1, "limit must be at least 1").max(50, "limit cannot exceed 50")),
});
