import { z } from 'zod';
import { AccountType } from '@prisma/client';

export const CreateAccountDtoSchema = z.object({
  name: z.string().min(2, 'Account name must be at least 2 characters'),
  type: z.nativeEnum(AccountType, { errorMap: () => ({ message: 'Invalid account type' }) }),
  balance: z.number().optional().default(0),
  currency: z.string().optional().default('PHP'),
  allowNegativeBalance: z.boolean().optional().default(false),
});

export type CreateAccountDto = z.infer<typeof CreateAccountDtoSchema>;
