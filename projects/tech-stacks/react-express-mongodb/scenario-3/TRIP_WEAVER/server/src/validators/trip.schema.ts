import { z } from "zod";

export const createTripSchema = z.object({
  title: z.string().min(1).max(200),
  destination: z.string().min(1),
  destinationTimezone: z.string().min(1).default("UTC"),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  budget: z.number().min(0).default(0),
  currency: z.string().default("USD"),
  collaboratorIds: z.array(z.string().length(24)).default([]),
  notes: z.string().max(2000).default(""),
  coverUrl: z.string().url().optional().or(z.literal("")),
});

export const tripIdParamSchema = z.object({
  tripId: z.string().length(24),
});

// L3-T2: statsQuerySchema — validates ?topN query param (1–25, default 5)
// This schema is wired to the route in Level 3 Task 2.
export const statsQuerySchema = z.object({
  topN: z
    .string()
    .optional()
    .transform((v) => (v === undefined ? 5 : Number(v)))
    .pipe(z.number().int().min(1).max(25)),
});
