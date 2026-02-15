import { z } from 'zod';

export const updateInventorySchema = z.object({
  quantity: z.number().int('Quantity must be an integer'),
});

export type UpdateInventoryDto = z.infer<typeof updateInventorySchema>;
