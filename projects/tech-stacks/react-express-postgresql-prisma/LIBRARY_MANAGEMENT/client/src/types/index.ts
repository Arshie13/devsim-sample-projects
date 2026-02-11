export type BorrowStatus = 'BORROWED' | 'RETURNED' | 'OVERDUE';
export type BorrowerType = 'MEMBER' | 'WALK_IN';

export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  idNumber: string;
  /** Base-64 data-URL of the captured ID photo */
  idPhoto: string | null;
  createdAt: string;
}

export interface WalkInBorrower {
  id: string;
  name: string;
  email: string;
  phone: string;
  idNumber: string;
  /** Base-64 data-URL of the captured ID photo */
  idPhoto: string | null;
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
  bookId: string;
  borrowerType: BorrowerType;
  /** Set when borrowerType === 'MEMBER' */
  memberId: string | null;
  /** Set when borrowerType === 'WALK_IN' */
  walkInBorrowerId: string | null;
  borrowedAt: string;
  dueDate: string;
  returnedAt: string | null;
  status: BorrowStatus;
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
