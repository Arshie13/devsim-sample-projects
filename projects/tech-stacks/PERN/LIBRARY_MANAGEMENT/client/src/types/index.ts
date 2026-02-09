export type Role = 'MEMBER' | 'LIBRARIAN' | 'ADMIN';

export type BorrowStatus = 'BORROWED' | 'RETURNED' | 'OVERDUE';

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: Role;
  createdAt: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  description: string;
  isbn: string;
  totalCopies: number;
  availableCopies: number;
  createdAt: string;
}

export interface BorrowRecord {
  id: string;
  userId: string;
  bookId: string;
  borrowedAt: string;
  dueDate: string;
  returnedAt: string | null;
  status: BorrowStatus;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export const GENRES = [
  'Fiction',
  'Non-Fiction',
  'Science Fiction',
  'Mystery',
  'Fantasy',
  'Biography',
  'History',
  'Self-Help',
  'Technology',
  'Romance',
] as const;
