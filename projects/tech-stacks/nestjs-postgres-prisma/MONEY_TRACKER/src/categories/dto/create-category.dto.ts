import { z } from 'zod';
import { CategoryType } from '@prisma/client';

export const CreateCategoryDtoSchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters'),
  type: z.nativeEnum(CategoryType, { errorMap: () => ({ message: 'Invalid category type' }) }),
  icon: z.string().optional(),
});

export type CreateCategoryDto = z.infer<typeof CreateCategoryDtoSchema>;
