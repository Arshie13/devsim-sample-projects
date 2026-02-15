import { z } from 'zod';
import { TransactionType } from '@prisma/client';

export const CreateTransactionDtoSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  type: z.nativeEnum(TransactionType, { errorMap: () => ({ message: 'Invalid transaction type' }) }),
  description: z.string().optional(),
  note: z.string().optional(),
  date: z.string().datetime().or(z.date()),
  accountId: z.string().uuid('Invalid account ID'),
  categoryId: z.string().uuid('Invalid category ID'),
});

export type CreateTransactionDto = z.infer<typeof CreateTransactionDtoSchema>;
