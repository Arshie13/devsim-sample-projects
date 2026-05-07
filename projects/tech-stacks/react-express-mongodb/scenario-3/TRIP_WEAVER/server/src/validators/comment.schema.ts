import { z } from "zod";

export const createCommentSchema = z.object({
  body: z.string().min(1).max(5000),
  tripId: z.string().length(24).optional(),
  stopId: z.string().length(24).optional(),
});
