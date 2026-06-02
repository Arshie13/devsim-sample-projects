import { z } from "zod";

export const createExpenseSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().default("USD"),
  description: z.string().max(500).default(""),
  splitBetween: z.array(z.string().length(24)).min(1),
});
