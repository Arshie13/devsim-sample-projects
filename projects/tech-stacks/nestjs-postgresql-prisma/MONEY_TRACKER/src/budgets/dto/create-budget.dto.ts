import { z } from 'zod';

export const CreateBudgetDtoSchema = z.object({
  amount: z.number().positive('Budget amount must be positive'),
  month: z.number().int().min(1).max(12, 'Month must be between 1 and 12'),
  year: z.number().int().min(2000).max(2100, 'Year must be between 2000 and 2100'),
  categoryId: z.string().uuid('Invalid category ID'),
});

export type CreateBudgetDto = z.infer<typeof CreateBudgetDtoSchema>;
