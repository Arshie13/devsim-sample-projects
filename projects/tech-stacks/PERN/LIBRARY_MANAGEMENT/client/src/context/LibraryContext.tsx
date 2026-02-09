import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { Book, BorrowRecord } from '../types';
import { libraryService } from '../services/libraryService';

interface LibraryContextType {
  books: Book[];
  borrowRecords: BorrowRecord[];
  loading: boolean;
  error: string | null;
  fetchBooks: () => Promise<void>;
  fetchBorrowRecords: (userId?: string) => Promise<void>;
  borrowBook: (bookId: string, userId: string) => Promise<boolean>;
  returnBook: (recordId: string) => Promise<boolean>;
  addBook: (
    data: Omit<Book, 'id' | 'createdAt' | 'availableCopies'>,
  ) => Promise<boolean>;
  updateBook: (id: string, data: Partial<Book>) => Promise<boolean>;
  archiveBook: (id: string) => Promise<boolean>;
  clearError: () => void;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export function LibraryProvider({ children }: { children: ReactNode }) {
  const [books, setBooks] = useState<Book[]>([]);
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

  const fetchBorrowRecords = useCallback(async (userId?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = userId
        ? await libraryService.getBorrowHistory(userId)
        : await libraryService.getAllBorrowRecords();
      setBorrowRecords(data);
    } catch {
      setError('Failed to fetch borrow records');
    } finally {
      setLoading(false);
    }
  }, []);

  const borrowBook = async (
    bookId: string,
    userId: string,
  ): Promise<boolean> => {
    try {
      await libraryService.borrowBook(bookId, userId);
      await fetchBooks();
      return true;
    } catch {
      setError('Failed to borrow book');
      return false;
    }
  };

  const returnBook = async (recordId: string): Promise<boolean> => {
    try {
      await libraryService.returnBook(recordId);
      await fetchBooks();
      return true;
    } catch {
      setError('Failed to return book');
      return false;
    }
  };

  const addBook = async (
    data: Omit<Book, 'id' | 'createdAt' | 'availableCopies'>,
  ): Promise<boolean> => {
    try {
      await libraryService.addBook(data);
      await fetchBooks();
      return true;
    } catch {
      setError('Failed to add book');
      return false;
    }
  };

  const updateBook = async (
    id: string,
    data: Partial<Book>,
  ): Promise<boolean> => {
    try {
      await libraryService.updateBook(id, data);
      await fetchBooks();
      return true;
    } catch {
      setError('Failed to update book');
      return false;
    }
  };

  const archiveBook = async (id: string): Promise<boolean> => {
    try {
      await libraryService.archiveBook(id);
      await fetchBooks();
      return true;
    } catch {
      setError('Failed to archive book');
      return false;
    }
  };

  const clearError = () => setError(null);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  return (
    <LibraryContext.Provider
      value={{
        books,
        borrowRecords,
        loading,
        error,
        fetchBooks,
        fetchBorrowRecords,
        borrowBook,
        returnBook,
        addBook,
        updateBook,
        archiveBook,
        clearError,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary() {
  const context = useContext(LibraryContext);
  if (!context)
    throw new Error('useLibrary must be used within LibraryProvider');
  return context;
}
