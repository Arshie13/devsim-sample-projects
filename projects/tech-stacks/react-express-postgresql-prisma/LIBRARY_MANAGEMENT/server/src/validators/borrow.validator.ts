import { z } from 'zod';

export const borrowBookMemberSchema = z.object({
  bookId: z.string().uuid({ message: 'Invalid book ID' }),
  memberId: z.string().uuid({ message: 'Invalid member ID' }),
  dueDate: z.string().datetime({ message: 'Invalid due date format' }),
});

export const borrowBookWalkInSchema = z.object({
  bookId: z.string().uuid({ message: 'Invalid book ID' }),
  dueDate: z.string().datetime({ message: 'Invalid due date format' }),
  walkInBorrower: z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    email: z.string().email({ message: 'Invalid email address' }),
    phone: z.string().min(10, { message: 'Phone must be at least 10 characters' }),
    idNumber: z.string().min(1, { message: 'ID number is required' }),
    idPhoto: z.string().nullable(),
  }),
});

export const returnBookSchema = z.object({
  recordId: z.string().uuid({ message: 'Invalid record ID' }),
});
