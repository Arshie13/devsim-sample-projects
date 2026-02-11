import { z } from 'zod';

export const createMemberSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  phone: z.string().min(10, { message: 'Phone must be at least 10 characters' }),
  idNumber: z.string().min(1, { message: 'ID number is required' }),
  idPhoto: z.string().nullable(),
});

export const updateMemberSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(10).optional(),
  idNumber: z.string().min(1).optional(),
  idPhoto: z.string().nullable().optional(),
});
