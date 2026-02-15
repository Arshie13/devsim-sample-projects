import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  image: z.string().url('Invalid image URL'),
  sku: z.string().min(1, 'SKU is required'),
  weight: z.string().optional(),
  roastLevel: z.string().optional(),
  stock: z.number().int().min(0, 'Stock cannot be negative').default(0),
  categoryId: z.string().min(1, 'Category ID is required'),
});

export type CreateProductDto = z.infer<typeof createProductSchema>;
