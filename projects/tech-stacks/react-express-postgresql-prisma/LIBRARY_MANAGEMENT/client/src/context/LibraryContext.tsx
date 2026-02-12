import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { Book, BorrowRecord, Member, WalkInBorrower } from '../types';
import { libraryService } from '../services/libraryService';
import { generateId, getDueDate } from '../utils/helpers';

interface LibraryContextType {
  books: Book[];
  members: Member[];
  walkInBorrowers: WalkInBorrower[];
  borrowRecords: BorrowRecord[];
  loading: boolean;
  error: string | null;
  fetchBooks: () => Promise<void>;
  fetchMembers: () => Promise<void>;
  fetchWalkInBorrowers: () => Promise<void>;
  fetchBorrowRecords: () => Promise<void>;
  borrowBookMember: (bookId: string, memberId: string) => Promise<boolean>;
  borrowBookWalkIn: (
    bookId: string,
    walkInData: Omit<WalkInBorrower, 'id' | 'createdAt'>,
  ) => Promise<boolean>;
  returnBook: (recordId: string) => Promise<boolean>;
  addBook: (
    data: Omit<Book, 'id' | 'createdAt' | 'availableCopies'>,
  ) => Promise<boolean>;
  updateBook: (id: string, data: Partial<Book>) => Promise<boolean>;
  archiveBook: (id: string) => Promise<boolean>;
  addMember: (data: Omit<Member, 'id' | 'createdAt'>) => Promise<boolean>;
  getBorrowerName: (record: BorrowRecord) => string;
  clearError: () => void;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export function LibraryProvider({ children }: { children: ReactNode }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [walkInBorrowers, setWalkInBorrowers] = useState<WalkInBorrower[]>([]);
  const [borrowRecords, setBorrowRecords] = useState<BorrowRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await libraryService.getBooks();
      setBooks(data);
    } catch {
      setError('Failed to fetch books');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await libraryService.getMembers();
      setMembers(data);
    } catch {
      setError('Failed to fetch members');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchWalkInBorrowers = useCallback(async () => {
    try {
      const data = await libraryService.getWalkInBorrowers();
      setWalkInBorrowers(data);
    } catch {
      // non-critical – walk-in list is secondary
    }
  }, []);

  const fetchBorrowRecords = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await libraryService.getAllBorrowRecords();
      setBorrowRecords(data);
    } catch {
      setError('Failed to fetch borrow records');
    } finally {
      setLoading(false);
    }
  }, []);

  /* ── Name resolver that works for both member & walk-in ── */
  const getBorrowerName = useCallback(
    (record: BorrowRecord): string => {
      if (record.borrowerType === 'MEMBER' && record.memberId) {
        return members.find((m) => m.id === record.memberId)?.name ?? 'Unknown Member';
      }
      if (record.borrowerType === 'WALK_IN' && record.walkInBorrowerId) {
        return (
          walkInBorrowers.find((w) => w.id === record.walkInBorrowerId)?.name ??
          'Walk-in'
        );
      }
      return 'Unknown';
    },
    [members, walkInBorrowers],
  );

  /* ═══════════════════════════════════════════════════════════════════════
     OPTIMISTIC UPDATES — UI updates instantly, rolls back on failure
     ═══════════════════════════════════════════════════════════════════════ */

  const borrowBookMember = async (
    bookId: string,
    memberId: string,
  ): Promise<boolean> => {
    // Snapshot for rollback
    const prevBooks = books;
    const prevRecords = borrowRecords;

    // Optimistic update
    const now = new Date().toISOString();
    const tempRecordId = generateId();
    const optimisticRecord: BorrowRecord = {
      id: tempRecordId,
      bookId,
      borrowerType: 'MEMBER',
      memberId,
      walkInBorrowerId: null,
      borrowedAt: now,
      dueDate: getDueDate(now),
      returnedAt: null,
      status: 'BORROWED',
    };

    setBooks((prev) =>
      prev.map((b) =>
        b.id === bookId ? { ...b, availableCopies: b.availableCopies - 1 } : b,
      ),
    );
    setBorrowRecords((prev) => [optimisticRecord, ...prev]);

    try {
      // Sync with service — will return actual record with real ID
      const actualRecord = await libraryService.borrowBookMember(bookId, memberId);
      // Replace temp record with actual
      setBorrowRecords((prev) =>
        prev.map((r) => (r.id === tempRecordId ? actualRecord : r)),
      );
      return true;
    } catch (err) {
      // Rollback
      setBooks(prevBooks);
      setBorrowRecords(prevRecords);
      setError(err instanceof Error ? err.message : 'Failed to issue book');
      return false;
    }
  };

  const borrowBookWalkIn = async (
    bookId: string,
    walkInData: Omit<WalkInBorrower, 'id' | 'createdAt'>,
  ): Promise<boolean> => {
    // Snapshot for rollback
    const prevBooks = books;
    const prevRecords = borrowRecords;
    const prevWalkIns = walkInBorrowers;

    // Optimistic update
    const now = new Date().toISOString();
    const tempWalkInId = generateId();
    const tempRecordId = generateId();

    const optimisticWalkIn: WalkInBorrower = {
      id: tempWalkInId,
      ...walkInData,
      createdAt: now,
    };

    const optimisticRecord: BorrowRecord = {
      id: tempRecordId,
      bookId,
      borrowerType: 'WALK_IN',
      memberId: null,
      walkInBorrowerId: tempWalkInId,
      borrowedAt: now,
      dueDate: getDueDate(now),
      returnedAt: null,
      status: 'BORROWED',
    };

    setBooks((prev) =>
      prev.map((b) =>
        b.id === bookId ? { ...b, availableCopies: b.availableCopies - 1 } : b,
      ),
    );
    setWalkInBorrowers((prev) => [optimisticWalkIn, ...prev]);
    setBorrowRecords((prev) => [optimisticRecord, ...prev]);

    try {
      const { record, walkIn } = await libraryService.borrowBookWalkIn(bookId, walkInData);
      // Replace temp entries with actual
      setWalkInBorrowers((prev) =>
        prev.map((w) => (w.id === tempWalkInId ? walkIn : w)),
      );
      setBorrowRecords((prev) =>
        prev.map((r) => (r.id === tempRecordId ? record : r)),
      );
      return true;
    } catch (err) {
      // Rollback
      setBooks(prevBooks);
      setWalkInBorrowers(prevWalkIns);
      setBorrowRecords(prevRecords);
      setError(err instanceof Error ? err.message : 'Failed to issue book');
      return false;
    }
  };

  const returnBook = async (recordId: string): Promise<boolean> => {
    // Snapshot for rollback
    const prevBooks = books;
    const prevRecords = borrowRecords;

    const record = borrowRecords.find((r) => r.id === recordId);
    if (!record) {
      setError('Record not found');
      return false;
    }

    // Optimistic update
    const now = new Date().toISOString();
    setBorrowRecords((prev) =>
      prev.map((r) =>
        r.id === recordId ? { ...r, returnedAt: now, status: 'RETURNED' as const } : r,
      ),
    );
    setBooks((prev) =>
      prev.map((b) =>
        b.id === record.bookId
          ? { ...b, availableCopies: b.availableCopies + 1 }
          : b,
      ),
    );

    try {
      const actualRecord = await libraryService.returnBook(recordId);
      setBorrowRecords((prev) =>
        prev.map((r) => (r.id === recordId ? actualRecord : r)),
      );
      return true;
    } catch {
      // Rollback
      setBooks(prevBooks);
      setBorrowRecords(prevRecords);
      setError('Failed to return book');
      return false;
    }
  };

  const addBook = async (
    data: Omit<Book, 'id' | 'createdAt' | 'availableCopies'>,
  ): Promise<boolean> => {
    const prevBooks = books;
    const tempId = generateId();
    const optimisticBook: Book = {
      id: tempId,
      ...data,
      availableCopies: data.totalCopies,
      createdAt: new Date().toISOString(),
    };

    setBooks((prev) => [optimisticBook, ...prev]);

    try {
      const actualBook = await libraryService.addBook(data);
      setBooks((prev) => prev.map((b) => (b.id === tempId ? actualBook : b)));
      return true;
    } catch {
      setBooks(prevBooks);
      setError('Failed to add book');
      return false;
    }
  };

  const updateBook = async (
    id: string,
    data: Partial<Book>,
  ): Promise<boolean> => {
    const prevBooks = books;

    // Optimistic update
    setBooks((prev) => prev.map((b) => (b.id === id ? { ...b, ...data } : b)));

    try {
      const actualBook = await libraryService.updateBook(id, data);
      setBooks((prev) => prev.map((b) => (b.id === id ? actualBook : b)));
      return true;
    } catch {
      setBooks(prevBooks);
      setError('Failed to update book');
      return false;
    }
  };

  const archiveBook = async (id: string): Promise<boolean> => {
    const prevBooks = books;

    // Optimistic update — remove from list
    setBooks((prev) => prev.filter((b) => b.id !== id));

    try {
      await libraryService.archiveBook(id);
      return true;
    } catch {
      setBooks(prevBooks);
      setError('Failed to archive book');
      return false;
    }
  };

  const addMember = async (
    data: Omit<Member, 'id' | 'createdAt'>,
  ): Promise<boolean> => {
    const prevMembers = members;
    const tempId = generateId();
    const optimisticMember: Member = {
      id: tempId,
      ...data,
      createdAt: new Date().toISOString(),
    };

    setMembers((prev) => [optimisticMember, ...prev]);

    try {
      const actualMember = await libraryService.addMember(data);
      setMembers((prev) => prev.map((m) => (m.id === tempId ? actualMember : m)));
      return true;
    } catch (err) {
      setMembers(prevMembers);
      setError(err instanceof Error ? err.message : 'Failed to add member');
      return false;
    }
  };

  const clearError = () => setError(null);

  useEffect(() => {
    fetchBooks();
    fetchMembers();
    fetchWalkInBorrowers();
    fetchBorrowRecords();
  }, [fetchBooks, fetchMembers, fetchWalkInBorrowers, fetchBorrowRecords]);

  return (
    <LibraryContext.Provider
      value={{
        books,
        members,
        walkInBorrowers,
        borrowRecords,
        loading,
        error,
        fetchBooks,
        fetchMembers,
        fetchWalkInBorrowers,
        fetchBorrowRecords,
        borrowBookMember,
        borrowBookWalkIn,
        returnBook,
        addBook,
        updateBook,
        archiveBook,
        addMember,
        getBorrowerName,
        clearError,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLibrary() {
  const context = useContext(LibraryContext);
  if (!context)
    throw new Error('useLibrary must be used within LibraryProvider');
  return context;
}
