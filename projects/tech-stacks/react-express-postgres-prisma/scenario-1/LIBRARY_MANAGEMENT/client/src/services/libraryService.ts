import { mockBooks } from '../data/books.mock';
import { mockMembers } from '../data/members.mock';
import { mockWalkInBorrowers } from '../data/walkInBorrowers.mock';
import { mockBorrowRecords } from '../data/borrowRecords.mock';
import type { Book, BorrowRecord, Member, WalkInBorrower } from '../types';
import { generateId, getDueDate } from '../utils/helpers';

let books: Book[] = [...mockBooks];
let members: Member[] = [...mockMembers];
let walkInBorrowers: WalkInBorrower[] = [...mockWalkInBorrowers];
let borrowRecords: BorrowRecord[] = [...mockBorrowRecords];

const delay = (ms: number = 500) => new Promise((res) => setTimeout(res, ms));

export const libraryService = {
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

  // ── Members ───────────────────────────────────────────
  async getMembers(): Promise<Member[]> {
    await delay();
    return members.map((m) => ({ ...m }));
  },

  async getMemberById(id: string): Promise<Member | null> {
    await delay();
    const member = members.find((m) => m.id === id);
    return member ? { ...member } : null;
  },

  async addMember(data: Omit<Member, 'id' | 'createdAt'>): Promise<Member> {
    await delay();
    if (members.some((m) => m.email === data.email)) {
      throw new Error('A member with this email already exists');
    }
    const newMember: Member = {
      id: generateId(),
      ...data,
      createdAt: new Date().toISOString(),
    };
    members.push(newMember);
    return { ...newMember };
  },

  // ── Walk-in Borrowers ─────────────────────────────────
  async getWalkInBorrowers(): Promise<WalkInBorrower[]> {
    await delay();
    return walkInBorrowers.map((w) => ({ ...w }));
  },

  async addWalkInBorrower(
    data: Omit<WalkInBorrower, 'id' | 'createdAt'>,
  ): Promise<WalkInBorrower> {
    await delay();
    const newWalkIn: WalkInBorrower = {
      id: generateId(),
      ...data,
      createdAt: new Date().toISOString(),
    };
    walkInBorrowers.push(newWalkIn);
    return { ...newWalkIn };
  },

  async getWalkInBorrowerById(id: string): Promise<WalkInBorrower | null> {
    await delay(100);
    const w = walkInBorrowers.find((b) => b.id === id);
    return w ? { ...w } : null;
  },

  // ── Borrowing ─────────────────────────────────────────
  async borrowBookMember(
    bookId: string,
    memberId: string,
  ): Promise<BorrowRecord> {
    await delay();
    const book = books.find((b) => b.id === bookId);
    if (!book) throw new Error('Book not found');
    if (book.availableCopies <= 0) throw new Error('No copies available');

    book.availableCopies -= 1;
    const now = new Date().toISOString();
    const record: BorrowRecord = {
      id: generateId(),
      bookId,
      borrowerType: 'MEMBER',
      memberId,
      walkInBorrowerId: null,
      borrowedAt: now,
      dueDate: getDueDate(now),
      returnedAt: null,
      status: 'BORROWED',
    };
    borrowRecords.push(record);
    return { ...record };
  },

  async borrowBookWalkIn(
    bookId: string,
    walkInData: Omit<WalkInBorrower, 'id' | 'createdAt'>,
  ): Promise<{ record: BorrowRecord; walkIn: WalkInBorrower }> {
    await delay();
    const book = books.find((b) => b.id === bookId);
    if (!book) throw new Error('Book not found');
    if (book.availableCopies <= 0) throw new Error('No copies available');

    // Create the walk-in borrower record first
    const walkIn: WalkInBorrower = {
      id: generateId(),
      ...walkInData,
      createdAt: new Date().toISOString(),
    };
    walkInBorrowers.push(walkIn);

    book.availableCopies -= 1;
    const now = new Date().toISOString();
    const record: BorrowRecord = {
      id: generateId(),
      bookId,
      borrowerType: 'WALK_IN',
      memberId: null,
      walkInBorrowerId: walkIn.id,
      borrowedAt: now,
      dueDate: getDueDate(now),
      returnedAt: null,
      status: 'BORROWED',
    };
    borrowRecords.push(record);
    return { record: { ...record }, walkIn: { ...walkIn } };
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
};
