import { z } from 'zod';
import { TransactionType } from '@prisma/client';

export const UpdateTransactionDtoSchema = z.object({
  amount: z.number().positive().optional(),
  type: z.nativeEnum(TransactionType).optional(),
  description: z.string().optional(),
  note: z.string().optional(),
  date: z.string().datetime().or(z.date()).optional(),
  accountId: z.string().uuid().optional(),
  categoryId: z.string().uuid().optional(),
});

export type UpdateTransactionDto = z.infer<typeof UpdateTransactionDtoSchema>;
