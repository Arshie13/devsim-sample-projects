import { z } from 'zod';
import { AccountType } from '@prisma/client';

export const UpdateAccountDtoSchema = z.object({
  name: z.string().min(2).optional(),
  type: z.nativeEnum(AccountType).optional(),
  allowNegativeBalance: z.boolean().optional(),
});

export type UpdateAccountDto = z.infer<typeof UpdateAccountDtoSchema>;
