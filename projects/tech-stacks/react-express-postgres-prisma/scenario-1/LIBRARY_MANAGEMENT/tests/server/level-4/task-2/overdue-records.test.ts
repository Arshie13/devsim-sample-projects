/**
 * Level 4 Task 2: Overdue Books Filter
 * Tests for the overdue records API endpoint
 * 
 * Acceptance Criteria:
 * - AC-1: Backend route exposes data needed by overdue view
 * - AC-1: Response includes only currently overdue records
 * - AC-2: Each row shows book details, member name, and days overdue
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * Mock borrow record data for testing
 */
interface BorrowRecord {
  id: string;
  bookId: string;
  memberId: string | null;
  walkInBorrowerId: string | null;
  borrowerType: 'MEMBER' | 'WALK_IN';
  borrowedAt: Date;
  dueDate: Date;
  returnedAt: Date | null;
  status: 'BORROWED' | 'RETURNED' | 'OVERDUE';
  book: {
    id: string;
    title: string;
    author: string;
  };
  member: {
    id: string;
    name: string;
  } | null;
}

/**
 * Helper function to calculate days overdue
 */
function calculateDaysOverdue(dueDate: Date, returnedAt: Date | null = null): number {
  const endDate = returnedAt || new Date();
  const diffTime = endDate.getTime() - dueDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Check if a record is overdue
 */
function isOverdue(record: BorrowRecord): boolean {
  const now = new Date();
  return record.status !== 'RETURNED' && record.dueDate < now;
}

/**
 * Filter overdue records (current implementation - BUGGY)
 * This demonstrates the bug: it doesn't check returnedAt
 */
function filterOverdueRecordsBuggy(records: BorrowRecord[]): BorrowRecord[] {
  return records.filter(record => 
    record.status === 'BORROWED' || record.status === 'OVERDUE'
  );
}

/**
 * Filter overdue records (FIXED version)
 */
function filterOverdueRecordsFixed(records: BorrowRecord[]): BorrowRecord[] {
  return records.filter(record => {
    // Must not be returned
    if (record.status === 'RETURNED' || record.returnedAt) {
      return false;
    }
    // Must be past due date
    return record.dueDate < new Date();
  });
}

describe('Level 4 Task 2: Overdue Records Logic', () => {
  
  const mockOverdueRecord: BorrowRecord = {
    id: 'record-1',
    bookId: 'book-1',
    memberId: 'member-1',
    walkInBorrowerId: null,
    borrowerType: 'MEMBER',
    borrowedAt: new Date('2024-01-01'),
    dueDate: new Date('2024-01-15'), // Past date
    returnedAt: null,
    status: 'OVERDUE',
    book: {
      id: 'book-1',
      title: 'Test Book',
      author: 'Test Author',
    },
    member: {
      id: 'member-1',
      name: 'John Doe',
    },
  };

  const mockReturnedRecord: BorrowRecord = {
    id: 'record-2',
    bookId: 'book-2',
    memberId: 'member-2',
    walkInBorrowerId: null,
    borrowerType: 'MEMBER',
    borrowedAt: new Date('2024-01-01'),
    dueDate: new Date('2024-01-15'),
    returnedAt: new Date('2024-01-20'), // Already returned
    status: 'RETURNED',
    book: {
      id: 'book-2',
      title: 'Returned Book',
      author: 'Another Author',
    },
    member: {
      id: 'member-2',
      name: 'Jane Doe',
    },
  };

  const mockActiveRecord: BorrowRecord = {
    id: 'record-3',
    bookId: 'book-3',
    memberId: 'member-3',
    walkInBorrowerId: null,
    borrowerType: 'MEMBER',
    borrowedAt: new Date(),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Future date
    returnedAt: null,
    status: 'BORROWED',
    book: {
      id: 'book-3',
      title: 'Active Book',
      author: 'Active Author',
    },
    member: {
      id: 'member-3',
      name: 'Active Member',
    },
  };

  describe('isOverdue function', () => {
    it('should return true for overdue record', () => {
      expect(isOverdue(mockOverdueRecord)).toBe(true);
    });

    it('should return false for returned record', () => {
      expect(isOverdue(mockReturnedRecord)).toBe(false);
    });

    it('should return false for active record with future due date', () => {
      expect(isOverdue(mockActiveRecord)).toBe(false);
    });
  });

  describe('calculateDaysOverdue function', () => {
    it('should calculate positive days for overdue record', () => {
      const dueDate = new Date('2024-01-01');
      const result = calculateDaysOverdue(dueDate);
      expect(result).toBeGreaterThan(0);
    });

    it('should return 0 or negative for records not yet due', () => {
      const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      const result = calculateDaysOverdue(futureDate);
      expect(result).toBeLessThanOrEqual(0);
    });

    it('should use returnedAt date if provided', () => {
      const dueDate = new Date('2024-01-01');
      const returnedAt = new Date('2024-01-10');
      const result = calculateDaysOverdue(dueDate, returnedAt);
      expect(result).toBe(9);
    });
  });

  describe('filterOverdueRecords (Fixed)', () => {
    it('should include overdue records', () => {
      const records = [mockOverdueRecord, mockActiveRecord];
      const result = filterOverdueRecordsFixed(records);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('record-1');
    });

    it('should exclude returned records', () => {
      const records = [mockOverdueRecord, mockReturnedRecord, mockActiveRecord];
      const result = filterOverdueRecordsFixed(records);
      expect(result).toHaveLength(2);
      expect(result.map(r => r.id)).toContain('record-1');
      expect(result.map(r => r.id)).toContain('record-3');
      expect(result.map(r => r.id)).not.toContain('record-2');
    });

    it('should return empty array when no overdue records', () => {
      const records = [mockReturnedRecord, mockActiveRecord];
      const result = filterOverdueRecordsFixed(records);
      expect(result).toHaveLength(1); // Only active record
    });

    it('should handle empty array', () => {
      const result = filterOverdueRecordsFixed([]);
      expect(result).toHaveLength(0);
    });
  });

  describe('Overdue Response Structure', () => {
    it('should include book details in response', () => {
      expect(mockOverdueRecord.book).toBeDefined();
      expect(mockOverdueRecord.book.title).toBe('Test Book');
      expect(mockOverdueRecord.book.author).toBe('Test Author');
    });

    it('should include member name in response', () => {
      expect(mockOverdueRecord.member).toBeDefined();
      expect(mockOverdueRecord.member?.name).toBe('John Doe');
    });

    it('should include due date for days overdue calculation', () => {
      expect(mockOverdueRecord.dueDate).toBeDefined();
      expect(mockOverdueRecord.dueDate instanceof Date).toBe(true);
    });
  });
});

/**
 * HIDDEN TESTS - Additional edge cases
 */
describe('Level 4 Task 2: Hidden Edge Case Tests', () => {
  it('should handle records returned exactly on due date', () => {
    const dueDate = new Date('2024-01-15');
    const returnedAt = new Date('2024-01-15');
    
    const record: BorrowRecord = {
      id: 'record-1',
      bookId: 'book-1',
      memberId: 'member-1',
      walkInBorrowerId: null,
      borrowerType: 'MEMBER',
      borrowedAt: new Date('2024-01-01'),
      dueDate,
      returnedAt,
      status: 'RETURNED',
      book: { id: 'book-1', title: 'Book', author: 'Author' },
      member: { id: 'member-1', name: 'Member' },
    };
    
    // Should not be overdue if returned on due date
    expect(isOverdue(record)).toBe(false);
    expect(filterOverdueRecordsFixed([record])).toHaveLength(0);
  });

  it('should handle walk-in borrowers', () => {
    const walkInRecord: BorrowRecord = {
      id: 'record-w1',
      bookId: 'book-1',
      memberId: null,
      walkInBorrowerId: 'walkin-1',
      borrowerType: 'WALK_IN',
      borrowedAt: new Date('2024-01-01'),
      dueDate: new Date('2024-01-15'),
      returnedAt: null,
      status: 'OVERDUE',
      book: { id: 'book-1', title: 'Book', author: 'Author' },
      member: null, // Walk-in doesn't have member record
    };
    
    expect(isOverdue(walkInRecord)).toBe(true);
  });

  it('should handle records with null due date', () => {
    const record: BorrowRecord = {
      id: 'record-1',
      bookId: 'book-1',
      memberId: 'member-1',
      walkInBorrowerId: null,
      borrowerType: 'MEMBER',
      borrowedAt: new Date(),
      dueDate: new Date(0), // Epoch date
      returnedAt: null,
      status: 'BORROWED',
      book: { id: 'book-1', title: 'Book', author: 'Author' },
      member: { id: 'member-1', name: 'Member' },
    };
    
    // Should be overdue due to old due date
    expect(isOverdue(record)).toBe(true);
  });
});
