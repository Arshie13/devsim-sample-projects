import { mockBooks } from '../data/books.mock';
import { mockUsers } from '../data/users.mock';
import { mockBorrowRecords } from '../data/borrowRecords.mock';
import type { Book, BorrowRecord, User, RegisterData } from '../types';
import { generateId, getDueDate } from '../utils/helpers';

// Mutable internal state (simulates a real database)
let books: Book[] = [...mockBooks];
let users: User[] = [...mockUsers];
let borrowRecords: BorrowRecord[] = [...mockBorrowRecords];

const delay = (ms: number = 500) => new Promise((res) => setTimeout(res, ms));

export const libraryService = {
  // ── Auth ──────────────────────────────────────────────
  async login(email: string, password: string): Promise<User | null> {
    await delay();
    const user = users.find(
      (u) => u.email === email && u.password === password,
    );
    return user ? { ...user } : null;
  },

  async register(data: RegisterData): Promise<User> {
    await delay();
    if (users.some((u) => u.email === data.email)) {
      throw new Error('Email already exists');
    }
    const newUser: User = {
      id: generateId(),
      ...data,
      role: 'MEMBER',
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    return { ...newUser };
  },

  // ── Books ─────────────────────────────────────────────
  async getBooks(): Promise<Book[]> {
    await delay();
    return books.map((b) => ({ ...b }));
  },

  async getBookById(id: string): Promise<Book | null> {
    await delay();
    const book = books.find((b) => b.id === id);
    return book ? { ...book } : null;
  },

  async addBook(
    bookData: Omit<Book, 'id' | 'createdAt' | 'availableCopies'>,
  ): Promise<Book> {
    await delay();
    const newBook: Book = {
      id: generateId(),
      ...bookData,
      availableCopies: bookData.totalCopies,
      createdAt: new Date().toISOString(),
    };
    books.push(newBook);
    return { ...newBook };
  },

  async updateBook(id: string, data: Partial<Book>): Promise<Book> {
    await delay();
    const index = books.findIndex((b) => b.id === id);
    if (index === -1) throw new Error('Book not found');
    books[index] = { ...books[index], ...data };
    return { ...books[index] };
  },

  async archiveBook(id: string): Promise<void> {
    await delay();
    books = books.filter((b) => b.id !== id);
  },

  // ── Borrowing ─────────────────────────────────────────
  async borrowBook(bookId: string, userId: string): Promise<BorrowRecord> {
    await delay();
    const book = books.find((b) => b.id === bookId);
    if (!book) throw new Error('Book not found');
    if (book.availableCopies <= 0) throw new Error('No copies available');

    book.availableCopies -= 1;
    const now = new Date().toISOString();
    const record: BorrowRecord = {
      id: generateId(),
      userId,
      bookId,
      borrowedAt: now,
      dueDate: getDueDate(now),
      returnedAt: null,
      status: 'BORROWED',
    };
    borrowRecords.push(record);
    return { ...record };
  },

  async returnBook(recordId: string): Promise<BorrowRecord> {
    await delay();
    const record = borrowRecords.find((r) => r.id === recordId);
    if (!record) throw new Error('Record not found');

    const book = books.find((b) => b.id === record.bookId);
    if (book) book.availableCopies += 1;

    record.returnedAt = new Date().toISOString();
    record.status = 'RETURNED';
    return { ...record };
  },

  async getBorrowHistory(userId: string): Promise<BorrowRecord[]> {
    await delay();
    return borrowRecords
      .filter((r) => r.userId === userId)
      .map((r) => ({ ...r }));
  },

  async getAllBorrowRecords(): Promise<BorrowRecord[]> {
    await delay();
    return borrowRecords.map((r) => ({ ...r }));
  },

  async getOverdueRecords(): Promise<BorrowRecord[]> {
    await delay();
    const now = new Date();
    return borrowRecords
      .filter((r) => r.status !== 'RETURNED' && new Date(r.dueDate) < now)
      .map((r) => ({ ...r }));
  },

  // ── Users (admin) ─────────────────────────────────────
  async getUsers(): Promise<User[]> {
    await delay();
    return users.map((u) => ({ ...u }));
  },

  async getUserById(id: string): Promise<User | null> {
    await delay();
    const user = users.find((u) => u.id === id);
    return user ? { ...user } : null;
  },
};
