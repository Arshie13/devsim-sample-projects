export type BorrowStatus = 'BORROWED' | 'RETURNED' | 'OVERDUE';
export type BorrowerType = 'MEMBER' | 'WALK_IN';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface BookCreateInput {
  title: string;
  author: string;
  genre: string;
  description: string;
  isbn: string;
  totalCopies: number;
  availableCopies: number;
}

export interface BookUpdateInput {
  title?: string;
  author?: string;
  genre?: string;
  description?: string;
  isbn?: string;
  totalCopies?: number;
  availableCopies?: number;
}

export interface MemberCreateInput {
  name: string;
  email: string;
  phone: string;
  idNumber: string;
  idPhoto: string | null;
}

export interface MemberUpdateInput {
  name?: string;
  email?: string;
  phone?: string;
  idNumber?: string;
  idPhoto?: string | null;
}

export interface WalkInBorrowerCreateInput {
  name: string;
  email: string;
  phone: string;
  idNumber: string;
  idPhoto: string | null;
}

export interface BorrowBookMemberInput {
  bookId: string;
  memberId: string;
  dueDate: string;
}

export interface BorrowBookWalkInInput {
  bookId: string;
  walkInBorrower: WalkInBorrowerCreateInput;
  dueDate: string;
}

export interface ReturnBookInput {
  recordId: string;
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
