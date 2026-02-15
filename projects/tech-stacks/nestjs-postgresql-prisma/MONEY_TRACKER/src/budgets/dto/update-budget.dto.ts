import { z } from 'zod';

export const UpdateBudgetDtoSchema = z.object({
  amount: z.number().positive().optional(),
  month: z.number().int().min(1).max(12).optional(),
  year: z.number().int().min(2000).max(2100).optional(),
});

export type UpdateBudgetDto = z.infer<typeof UpdateBudgetDtoSchema>;
