import { z } from 'zod';

export const updateProductSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.number().positive().optional(),
  image: z.string().url().optional(),
  sku: z.string().min(1).optional(),
  weight: z.string().optional(),
  roastLevel: z.string().optional(),
  stock: z.number().int().min(0).optional(),
  categoryId: z.string().min(1).optional(),
});

export type UpdateProductDto = z.infer<typeof updateProductSchema>;
