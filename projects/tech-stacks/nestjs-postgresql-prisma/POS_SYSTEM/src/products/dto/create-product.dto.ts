import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(200),
  description: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  sku: z.string().min(1, 'SKU is required'),
  categoryId: z.string().uuid('Invalid category ID'),
  initialStock: z.number().int().min(0).optional().default(0),
});

export type CreateProductDto = z.infer<typeof createProductSchema>;
