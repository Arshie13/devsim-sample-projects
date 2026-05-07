import { z } from "zod";

export const createCommentSchema = z.object({
  workoutId: z.string().length(24, "Invalid workout id"),
  body: z.string().min(1, "Comment body is required").max(2000),
});
