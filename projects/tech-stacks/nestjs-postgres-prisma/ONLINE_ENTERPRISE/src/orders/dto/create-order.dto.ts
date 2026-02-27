import { z } from 'zod';
import { PaymentMethod } from '@prisma/client';

const orderItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().positive('Quantity must be positive'),
  price: z.number().positive('Price must be positive'),
});

export const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1, 'At least one item is required'),
  shippingAddress: z.string().min(1, 'Shipping address is required'),
  paymentMethod: z.nativeEnum(PaymentMethod),
});

export type CreateOrderDto = z.infer<typeof createOrderSchema>;
