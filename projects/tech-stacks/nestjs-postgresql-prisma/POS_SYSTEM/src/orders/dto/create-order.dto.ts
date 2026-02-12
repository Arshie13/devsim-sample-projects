import { z } from 'zod';

export const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().uuid('Invalid product ID'),
        quantity: z.number().int().positive('Quantity must be positive'),
      }),
    )
    .min(1, 'Order must have at least one item'),
  paymentMethod: z.enum(['CASH', 'CARD'], {
    errorMap: () => ({ message: 'Payment method must be CASH or CARD' }),
  }),
  discount: z.number().min(0).max(100).optional().default(0),
});

export type CreateOrderDto = z.infer<typeof createOrderSchema>;
