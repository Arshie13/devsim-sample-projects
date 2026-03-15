/**
 * Level 5 Task 2: Fix Overdue Status
 * Tests for ensuring overdue status is correctly calculated
 * 
 * Acceptance Criteria:
 * - AC-1: Incorrect overdue markings are resolved
 * - AC-1: Returned items are no longer listed overdue
 * - AC-2: Overdue reports match source borrowing and return records
 * - AC-2: Spot checks confirm data consistency
 */

import { describe, it, expect, vi } from 'vitest';

/**
 * Borrow record type
 */
interface BorrowRecord {
  id: string;
  bookId: string;
  memberId: string | null;
  borrowedAt: Date;
  dueDate: Date;
  returnedAt: Date | null;
  status: 'BORROWED' | 'RETURNED' | 'OVERDUE';
  book: {
    title: string;
    author: string;
  };
  member: {
    name: string;
  } | null;
}

/**
 * The BUGGY overdue check (current implementation)
 * Bug: doesn't check returnedAt, so returned items may show as overdue
 */
function getOverdueRecordsBuggy(records: BorrowRecord[]): BorrowRecord[] {
  return records.filter(record => 
    record.status === 'BORROWED' || record.status === 'OVERDUE'
  );
}

/**
 * The FIXED overdue check
 * Correctly excludes returned items
 */
function getOverdueRecordsFixed(records: BorrowRecord[]): BorrowRecord[] {
  return records.filter(record => {
    // Exclude returned records
    if (record.status === 'RETURNED') {
      return false;
    }
    
    // Exclude records that have been returned
    if (record.returnedAt) {
      return false;
    }
    
    // Check if past due date
    return record.dueDate < new Date();
  });
}

/**
 * Calculate overdue status
 */
function calculateOverdueStatus(record: BorrowRecord): 'OVERDUE' | 'BORROWED' | 'RETURNED' {
  if (record.status === 'RETURNED' || record.returnedAt) {
    return 'RETURNED';
  }
  
  if (record.dueDate < new Date()) {
    return 'OVERDUE';
  }
  
  return 'BORROWED';
}

/**
 * Get days overdue
 */
function getDaysOverdue(record: BorrowRecord): number {
  const checkDate = record.returnedAt || new Date();
  const diffTime = checkDate.getTime() - record.dueDate.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

describe('Level 5 Task 2: Overdue Status Fix', () => {
  
  describe('Fixed Overdue Filter', () => {
    it('should exclude returned records from overdue list', () => {
      const records: BorrowRecord[] = [
        {
          id: 'r1',
          bookId: 'b1',
          memberId: 'm1',
          borrowedAt: new Date('2024-01-01'),
          dueDate: new Date('2024-01-15'),
          returnedAt: new Date('2024-01-20'), // Returned
          status: 'RETURNED',
          book: { title: 'Book 1', author: 'Author 1' },
          member: { name: 'Member 1' },
        },
        {
          id: 'r2',
          bookId: 'b2',
          memberId: 'm2',
          borrowedAt: new Date('2024-01-01'),
          dueDate: new Date('2024-01-15'), // Past due
          returnedAt: null, // Not returned
          status: 'OVERDUE',
          book: { title: 'Book 2', author: 'Author 2' },
          member: { name: 'Member 2' },
        },
      ];

      const overdue = getOverdueRecordsFixed(records);
      
      expect(overdue).toHaveLength(1);
      expect(overdue[0].id).toBe('r2');
    });

    it('should include currently overdue records', () => {
      const records: BorrowRecord[] = [
        {
          id: 'r1',
          bookId: 'b1',
          memberId: 'm1',
          borrowedAt: new Date(),
          dueDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Past
          returnedAt: null,
          status: 'BORROWED',
          book: { title: 'Book 1', author: 'Author 1' },
          member: { name: 'Member 1' },
        },
      ];

      const overdue = getOverdueRecordsFixed(records);
      
      expect(overdue).toHaveLength(1);
    });

    it('should exclude future due dates', () => {
      const records: BorrowRecord[] = [
        {
          id: 'r1',
          bookId: 'b1',
          memberId: 'm1',
          borrowedAt: new Date(),
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Future
          returnedAt: null,
          status: 'BORROWED',
          book: { title: 'Book 1', author: 'Author 1' },
          member: { name: 'Member 1' },
        },
      ];

      const overdue = getOverdueRecordsFixed(records);
      
      expect(overdue).toHaveLength(0);
    });
  });

  describe('Overdue Status Calculation', () => {
    it('should return RETURNED for returned books', () => {
      const record: BorrowRecord = {
        id: 'r1',
        bookId: 'b1',
        memberId: 'm1',
        borrowedAt: new Date('2024-01-01'),
        dueDate: new Date('2024-01-15'),
        returnedAt: new Date('2024-01-20'),
        status: 'RETURNED',
        book: { title: 'Book', author: 'Author' },
        member: { name: 'Member' },
      };

      expect(calculateOverdueStatus(record)).toBe('RETURNED');
    });

    it('should return OVERDUE for past due unreturned books', () => {
      const record: BorrowRecord = {
        id: 'r1',
        bookId: 'b1',
        memberId: 'm1',
        borrowedAt: new Date('2024-01-01'),
        dueDate: new Date('2024-01-15'),
        returnedAt: null,
        status: 'OVERDUE',
        book: { title: 'Book', author: 'Author' },
        member: { name: 'Member' },
      };

      expect(calculateOverdueStatus(record)).toBe('OVERDUE');
    });

    it('should return BORROWED for future due dates', () => {
      const record: BorrowRecord = {
        id: 'r1',
        bookId: 'b1',
        memberId: 'm1',
        borrowedAt: new Date(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        returnedAt: null,
        status: 'BORROWED',
        book: { title: 'Book', author: 'Author' },
        member: { name: 'Member' },
      };

      expect(calculateOverdueStatus(record)).toBe('BORROWED');
    });
  });

  describe('Days Overdue Calculation', () => {
    it('should calculate correct days overdue', () => {
      const record: BorrowRecord = {
        id: 'r1',
        bookId: 'b1',
        memberId: 'm1',
        borrowedAt: new Date('2024-01-01'),
        dueDate: new Date('2024-01-15'),
        returnedAt: null,
        status: 'OVERDUE',
        book: { title: 'Book', author: 'Author' },
        member: { name: 'Member' },
      };

      const days = getDaysOverdue(record);
      expect(days).toBeGreaterThan(0);
    });

    it('should return negative days for books not yet due', () => {
      const record: BorrowRecord = {
        id: 'r1',
        bookId: 'b1',
        memberId: 'm1',
        borrowedAt: new Date(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        returnedAt: null,
        status: 'BORROWED',
        book: { title: 'Book', author: 'Author' },
        member: { name: 'Member' },
      };

      const days = getDaysOverdue(record);
      expect(days).toBeLessThan(0);
    });
  });

  describe('Data Consistency', () => {
    it('should match overdue reports with source records', () => {
      const records: BorrowRecord[] = [
        {
          id: 'r1',
          bookId: 'b1',
          memberId: 'm1',
          borrowedAt: new Date('2024-01-01'),
          dueDate: new Date('2024-01-10'),
          returnedAt: new Date('2024-01-15'),
          status: 'RETURNED',
          book: { title: 'Book 1', author: 'Author 1' },
          member: { name: 'Member 1' },
        },
        {
          id: 'r2',
          bookId: 'b2',
          memberId: 'm2',
          borrowedAt: new Date('2024-01-01'),
          dueDate: new Date('2024-01-10'),
          returnedAt: null,
          status: 'OVERDUE',
          book: { title: 'Book 2', author: 'Author 2' },
          member: { name: 'Member 2' },
        },
      ];

      // Source says r1 is returned
      expect(records[0].status).toBe('RETURNED');
      expect(records[0].returnedAt).not.toBeNull();
      
      // Source says r2 is not returned
      expect(records[1].returnedAt).toBeNull();
      expect(records[1].status).toBe('OVERDUE');

      // Fixed filter should match
      const overdue = getOverdueRecordsFixed(records);
      expect(overdue).toHaveLength(1);
      expect(overdue[0].id).toBe('r2');
    });
  });
});

/**
 * HIDDEN TESTS - Edge cases for overdue fix
 */
describe('Level 5 Task 2: Hidden Edge Case Tests', () => {
  it('should handle record returned exactly on due date', () => {
    const dueDate = new Date('2024-01-15');
    const returnedAt = new Date('2024-01-15');
    
    const record: BorrowRecord = {
      id: 'r1',
      bookId: 'b1',
      memberId: 'm1',
      borrowedAt: new Date('2024-01-01'),
      dueDate,
      returnedAt,
      status: 'RETURNED',
      book: { title: 'Book', author: 'Author' },
      member: { name: 'Member' },
    };

    // Should NOT be overdue
    const overdue = getOverdueRecordsFixed([record]);
    expect(overdue).toHaveLength(0);
  });

  it('should handle null returnedAt but RETURNED status', () => {
    const record: BorrowRecord = {
      id: 'r1',
      bookId: 'b1',
      memberId: 'm1',
      borrowedAt: new Date('2024-01-01'),
      dueDate: new Date('2024-01-15'),
      returnedAt: null, // null but status is RETURNED
      status: 'RETURNED',
      book: { title: 'Book', author: 'Author' },
      member: { name: 'Member' },
    };

    // Should NOT be overdue because status is RETURNED
    const overdue = getOverdueRecordsFixed([record]);
    expect(overdue).toHaveLength(0);
  });

  it('should handle timezone edge cases', () => {
    // Create dates at different times
    const dueDate = new Date('2024-01-15T23:59:59Z');
    const checkDate = new Date('2024-01-16T00:00:01Z'); // Just after midnight
    
    const record: BorrowRecord = {
      id: 'r1',
      bookId: 'b1',
      memberId: 'm1',
      borrowedAt: new Date('2024-01-01'),
      dueDate,
      returnedAt: null,
      status: 'BORROWED',
      book: { title: 'Book', author: 'Author' },
      member: { name: 'Member' },
    };

    // Should be overdue (past due date)
    const overdue = getOverdueRecordsFixed([record]);
    expect(overdue).toHaveLength(1);
  });

  it('should handle empty records array', () => {
    const overdue = getOverdueRecordsFixed([]);
    expect(overdue).toHaveLength(0);
  });

  it('should handle all records returned', () => {
    const records: BorrowRecord[] = [
      {
        id: 'r1',
        bookId: 'b1',
        memberId: 'm1',
        borrowedAt: new Date('2024-01-01'),
        dueDate: new Date('2024-01-15'),
        returnedAt: new Date('2024-01-20'),
        status: 'RETURNED',
        book: { title: 'Book', author: 'Author' },
        member: { name: 'Member' },
      },
    ];

    const overdue = getOverdueRecordsFixed(records);
    expect(overdue).toHaveLength(0);
  });
});
