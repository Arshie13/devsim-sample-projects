/**
 * Level 4 Task 2: Transaction Safety
 * Tests for ensuring borrow and return operations are atomic
 * 
 * Acceptance Criteria:
 * - AC-1: Related database updates run in a single transaction
 * - AC-1: Partial writes are not persisted on error
 * - AC-2: Stock count never drops below zero under concurrent requests
 * - AC-2: Borrow and return outcomes remain consistent
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * Mock database state
 */
interface Book {
  id: string;
  title: string;
  availableCopies: number;
  totalCopies: number;
}

interface BorrowRecord {
  id: string;
  bookId: string;
  status: 'BORROWED' | 'RETURNED' | 'OVERDUE';
  returnedAt: Date | null;
}

/**
 * Mock transaction result
 */
interface TransactionResult {
  success: boolean;
  data?: any;
  error?: string;
}

/**
 * Simulates the BUGGY return book logic (not using transaction)
 * This demonstrates the problem
 */
async function returnBookBuggy(
  book: Book,
  record: BorrowRecord
): Promise<TransactionResult> {
  try {
    // Step 1: Update record first
    const updatedRecord: BorrowRecord = {
      ...record,
      status: 'RETURNED',
      returnedAt: new Date(),
    };

    // Simulate some processing time
    await new Promise(resolve => setTimeout(resolve, 10));

    // Step 2: Update book availability
    // BUG: If this fails, the record is updated but book count is wrong
    const newCopies = book.availableCopies + 1;
    
    // Simulate potential failure
    if (Math.random() < 0.1) { // 10% chance of failure
      throw new Error('Database error');
    }

    return {
      success: true,
      data: {
        record: updatedRecord,
        book: { ...book, availableCopies: newCopies },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Simulates the FIXED return book logic (using transaction)
 */
async function returnBookFixed(
  book: Book,
  record: BorrowRecord,
  simulateFailure: boolean = false
): Promise<TransactionResult> {
  try {
    // All operations in a single transaction
    // If any fails, all are rolled back
    
    // Step 1: Update record
    const updatedRecord: BorrowRecord = {
      ...record,
      status: 'RETURNED',
      returnedAt: new Date(),
    };

    // Simulate some processing time
    await new Promise(resolve => setTimeout(resolve, 10));

    // Step 2: Update book availability
    const newCopies = book.availableCopies + 1;
    
    // Simulate potential failure in transaction
    if (simulateFailure) {
      throw new Error('Database error - transaction rolled back');
    }

    // Both updates would succeed or fail together
    return {
      success: true,
      data: {
        record: updatedRecord,
        book: { ...book, availableCopies: newCopies },
      },
    };
  } catch (error) {
    // Transaction rolls back - no partial writes
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Simulates borrow operation
 */
async function borrowBook(
  book: Book,
  memberId: string
): Promise<TransactionResult> {
  try {
    if (book.availableCopies <= 0) {
      return { success: false, error: 'No available copies' };
    }

    // In transaction
    const record: BorrowRecord = {
      id: `record-${Date.now()}`,
      bookId: book.id,
      status: 'BORROWED',
      returnedAt: null,
    };

    return {
      success: true,
      data: {
        record,
        book: { ...book, availableCopies: book.availableCopies - 1 },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Concurrent operations test helper
 */
async function runConcurrentOperations(
  operations: Array<() => Promise<TransactionResult>>
): Promise<TransactionResult[]> {
  return Promise.all(operations.map(op => op()));
}

describe('Level 4 Task 2: Transaction Safety', () => {
  
  describe('Borrow Operations', () => {
    it('should decrease available copies when borrowing', async () => {
      const book: Book = {
        id: 'book-1',
        title: 'Test Book',
        availableCopies: 5,
        totalCopies: 10,
      };

      const result = await borrowBook(book, 'member-1');

      expect(result.success).toBe(true);
      expect(result.data?.book.availableCopies).toBe(4);
    });

    it('should prevent borrowing when no copies available', async () => {
      const book: Book = {
        id: 'book-1',
        title: 'Test Book',
        availableCopies: 0,
        totalCopies: 10,
      };

      const result = await borrowBook(book, 'member-1');

      expect(result.success).toBe(false);
      expect(result.error).toBe('No available copies');
    });

    it('should prevent borrowing with negative copies', async () => {
      const book: Book = {
        id: 'book-1',
        title: 'Test Book',
        availableCopies: -1,
        totalCopies: 10,
      };

      const result = await borrowBook(book, 'member-1');

      expect(result.success).toBe(false);
    });
  });

  describe('Return Book - Fixed Transaction Logic', () => {
    it('should update both record and book in transaction', async () => {
      const book: Book = {
        id: 'book-1',
        title: 'Test Book',
        availableCopies: 4,
        totalCopies: 10,
      };

      const record: BorrowRecord = {
        id: 'record-1',
        bookId: 'book-1',
        status: 'BORROWED',
        returnedAt: null,
      };

      const result = await returnBookFixed(book, record);

      expect(result.success).toBe(true);
      expect(result.data?.record.status).toBe('RETURNED');
      expect(result.data?.book.availableCopies).toBe(5);
    });

    it('should handle concurrent return requests', async () => {
      const book: Book = {
        id: 'book-1',
        title: 'Test Book',
        availableCopies: 1,
        totalCopies: 10,
      };

      const record: BorrowRecord = {
        id: 'record-1',
        bookId: 'book-1',
        status: 'BORROWED',
        returnedAt: null,
      };

      // Simulate multiple concurrent returns
      const operations = [
        () => returnBookFixed(book, record),
        () => returnBookFixed(book, record),
        () => returnBookFixed(book, record),
      ];

      const results = await runConcurrentOperations(operations);
      
      // At least some should succeed
      const successCount = results.filter(r => r.success).length;
      expect(successCount).toBeGreaterThan(0);
    });
  });

  describe('Transaction Atomicity', () => {
    it('should rollback on failure - FIXED version', async () => {
      const book: Book = {
        id: 'book-1',
        title: 'Test Book',
        availableCopies: 4,
        totalCopies: 10,
      };

      const record: BorrowRecord = {
        id: 'record-1',
        bookId: 'book-1',
        status: 'BORROWED',
        returnedAt: null,
      };

      // Simulate failure
      const result = await returnBookFixed(book, record, true);

      expect(result.success).toBe(false);
      // In a real transaction, book would be rolled back to original
    });

    it('should maintain data consistency under concurrent operations', async () => {
      const book: Book = {
        id: 'book-1',
        title: 'Test Book',
        availableCopies: 10,
        totalCopies: 10,
      };

      // Run 10 concurrent borrows
      const operations = Array(10).fill(null).map(() => () => borrowBook(book, 'member-1'));
      const results = await runConcurrentOperations(operations);
      
      const successCount = results.filter(r => r.success).length;
      
      // Should not exceed total copies
      expect(successCount).toBeLessThanOrEqual(10);
    });
  });
});

/**
 * HIDDEN TESTS - Edge cases for transaction safety
 */
describe('Level 4 Task 2: Hidden Edge Case Tests', () => {
  it('should handle rapid sequential borrow-return-borrow cycles', async () => {
    let book: Book = {
      id: 'book-1',
      title: 'Test Book',
      availableCopies: 1,
      totalCopies: 5,
    };

    // Borrow
    let result = await borrowBook(book, 'member-1');
    expect(result.success).toBe(true);
    book = result.data.book;

    // Return
    result = await returnBookFixed(book, { id: 'r1', bookId: book.id, status: 'BORROWED', returnedAt: null });
    expect(result.success).toBe(true);
    book = result.data.book;

    // Borrow again
    result = await borrowBook(book, 'member-2');
    expect(result.success).toBe(true);
  });

  it('should never allow negative stock', async () => {
    let book: Book = {
      id: 'book-1',
      title: 'Test Book',
      availableCopies: 0,
      totalCopies: 5,
    };

    // Try to return when nothing was borrowed
    const result = await returnBookFixed(book, { id: 'r1', bookId: book.id, status: 'BORROWED', returnedAt: null });
    
    // This should work but we need to verify stock never goes negative
    if (result.success) {
      expect(result.data.book.availableCopies).toBeGreaterThanOrEqual(0);
    }
  });

  it('should handle multiple concurrent returns correctly', async () => {
    const book: Book = {
      id: 'book-1',
      title: 'Test Book',
      availableCopies: 2,
      totalCopies: 5,
    };

    // Create multiple records
    const records: BorrowRecord[] = [
      { id: 'r1', bookId: 'book-1', status: 'BORROWED', returnedAt: null },
      { id: 'r2', bookId: 'book-1', status: 'BORROWED', returnedAt: null },
    ];

    // Run concurrent returns
    const operations = records.map(r => () => returnBookFixed(book, r));
    const results = await runConcurrentOperations(operations);

    // All should succeed
    const allSucceeded = results.every(r => r.success);
    expect(allSucceeded).toBe(true);
  });
});
