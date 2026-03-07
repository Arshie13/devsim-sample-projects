import { z } from 'zod';

export const updateProductSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  price: z.number().positive('Price must be positive').optional(),
  categoryId: z.string().uuid('Invalid category ID').optional(),
  isActive: z.boolean().optional(),
});

export type UpdateProductDto = z.infer<typeof updateProductSchema>;
