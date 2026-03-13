import type { Book, BorrowRecord, Member, WalkInBorrower } from '../types';
import { getDueDate } from '../utils/helpers';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface BorrowWalkInApiPayload {
  record: BorrowRecord;
  walkInBorrower: WalkInBorrower;
}

const API_BASE_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, '') ??
  'http://localhost:5000/api';

const toErrorMessage = (body: unknown, fallback: string): string => {
  if (typeof body === 'object' && body !== null) {
    const maybeMessage = (body as { message?: unknown }).message;
    const maybeError = (body as { error?: unknown }).error;
    if (typeof maybeMessage === 'string' && maybeMessage.length > 0) {
      return maybeMessage;
    }
    if (typeof maybeError === 'string' && maybeError.length > 0) {
      return maybeError;
    }
  }
  return fallback;
};

const request = async <T>(
  path: string,
  options?: RequestInit,
): Promise<T> => {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
    ...options,
  });

  const body = (await res.json().catch(() => ({}))) as ApiResponse<T>;

  if (!res.ok || !body.success) {
    throw new Error(
      toErrorMessage(body, `Request failed with status ${res.status}`),
    );
  }

  if (typeof body.data === 'undefined') {
    throw new Error('Malformed API response: missing data payload');
  }

  return body.data;
};

const extractWalkInBorrowers = (
  records: BorrowRecord[],
): WalkInBorrower[] => {
  const byId = new Map<string, WalkInBorrower>();

  for (const record of records) {
    const walkIn = record.walkInBorrower;
    if (walkIn && !byId.has(walkIn.id)) {
      byId.set(walkIn.id, walkIn);
    }
  }

  return Array.from(byId.values());
};

export const libraryService = {
  // ── Books ─────────────────────────────────────────────
  async getBooks(): Promise<Book[]> {
    return request<Book[]>('/books');
  },

  async getBookById(id: string): Promise<Book | null> {
    try {
      return await request<Book>(`/books/${id}`);
    } catch {
      return null;
    }
  },

  async addBook(
    bookData: Omit<Book, 'id' | 'createdAt' | 'availableCopies'>,
  ): Promise<Book> {
    return request<Book>('/books', {
      method: 'POST',
      body: JSON.stringify({
        ...bookData,
        availableCopies: bookData.totalCopies,
      }),
    });
  },

  async updateBook(id: string, data: Partial<Book>): Promise<Book> {
    return request<Book>(`/books/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async archiveBook(id: string): Promise<void> {
    await request<{ message?: string }>(`/books/${id}`, {
      method: 'DELETE',
    });
  },

  // ── Members ───────────────────────────────────────────
  async getMembers(): Promise<Member[]> {
    return request<Member[]>('/members');
  },

  async getMemberById(id: string): Promise<Member | null> {
    try {
      return await request<Member>(`/members/${id}`);
    } catch {
      return null;
    }
  },

  async addMember(data: Omit<Member, 'id' | 'createdAt'>): Promise<Member> {
    return request<Member>('/members', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // ── Walk-in Borrowers ─────────────────────────────────
  async getWalkInBorrowers(): Promise<WalkInBorrower[]> {
    const records = await request<BorrowRecord[]>('/borrow-records');
    return extractWalkInBorrowers(records);
  },

  async addWalkInBorrower(
    data: Omit<WalkInBorrower, 'id' | 'createdAt'>,
  ): Promise<WalkInBorrower> {
    // There is no dedicated walk-in endpoint; this method is retained for compatibility.
    // Walk-in records are persisted through borrow flow.
    const now = new Date().toISOString();
    return {
      id: `temp-${crypto.randomUUID()}`,
      ...data,
      createdAt: now,
    };
  },

  async getWalkInBorrowerById(id: string): Promise<WalkInBorrower | null> {
    const walkIns = await libraryService.getWalkInBorrowers();
    return walkIns.find((w) => w.id === id) ?? null;
  },

  // ── Borrowing ─────────────────────────────────────────
  async borrowBookMember(
    bookId: string,
    memberId: string,
  ): Promise<BorrowRecord> {
    const now = new Date().toISOString();
    return request<BorrowRecord>('/borrow-records/member', {
      method: 'POST',
      body: JSON.stringify({
        bookId,
        memberId,
        dueDate: getDueDate(now),
      }),
    });
  },

  async borrowBookWalkIn(
    bookId: string,
    walkInData: Omit<WalkInBorrower, 'id' | 'createdAt'>,
  ): Promise<{ record: BorrowRecord; walkIn: WalkInBorrower }> {
    const now = new Date().toISOString();
    const payload = await request<BorrowWalkInApiPayload>('/borrow-records/walk-in', {
      method: 'POST',
      body: JSON.stringify({
        bookId,
        dueDate: getDueDate(now),
        walkInBorrower: walkInData,
      }),
    });

    return {
      record: payload.record,
      walkIn: payload.walkInBorrower,
    };
  },

  async returnBook(recordId: string): Promise<BorrowRecord> {
    return request<BorrowRecord>(`/borrow-records/${recordId}/return`, {
      method: 'PUT',
    });
  },

  async getAllBorrowRecords(): Promise<BorrowRecord[]> {
    return request<BorrowRecord[]>('/borrow-records');
  },

  async getOverdueRecords(): Promise<BorrowRecord[]> {
    return request<BorrowRecord[]>('/borrow-records/overdue');
  },
};
