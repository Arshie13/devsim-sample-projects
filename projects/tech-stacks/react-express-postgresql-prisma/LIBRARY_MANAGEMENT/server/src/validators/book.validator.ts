import { z } from 'zod';
import { GENRES } from '../types/index.js';

export const createBookSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  author: z.string().min(1, { message: 'Author is required' }),
  genre: z.enum(GENRES as unknown as [string, ...string[]], {
    message: 'Invalid genre',
  }),
  description: z.string().min(1, { message: 'Description is required' }),
  isbn: z.string().min(10, { message: 'ISBN must be at least 10 characters' }),
  totalCopies: z.number().int().min(1, { message: 'Total copies must be at least 1' }),
  availableCopies: z.number().int().min(0, { message: 'Available copies cannot be negative' }),
});

export const updateBookSchema = z.object({
  title: z.string().min(1).optional(),
  author: z.string().min(1).optional(),
  genre: z.enum(GENRES as unknown as [string, ...string[]]).optional(),
  description: z.string().min(1).optional(),
  isbn: z.string().min(10).optional(),
  totalCopies: z.number().int().min(1).optional(),
  availableCopies: z.number().int().min(0).optional(),
});
