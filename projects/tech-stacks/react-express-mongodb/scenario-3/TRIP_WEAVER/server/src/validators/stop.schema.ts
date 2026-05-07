import { z } from "zod";

export const createStopSchema = z.object({
  title: z.string().min(1).max(200),
  category: z.enum(["lodging", "food", "activity", "transport", "other"]).default("activity"),
  location: z.string().max(200).default(""),
  notes: z.string().max(2000).default(""),
  dayDate: z.string().datetime(),
  order: z.number().int().min(0).default(0),
});

export const stopParamsSchema = z.object({
  tripId: z.string().length(24),
  stopId: z.string().length(24),
});
