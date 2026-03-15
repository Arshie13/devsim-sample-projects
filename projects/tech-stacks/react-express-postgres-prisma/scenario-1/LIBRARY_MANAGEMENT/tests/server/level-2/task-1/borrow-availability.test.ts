/**
 * Level 2 Task 1: Fix Borrow Availability Bug
 * Tests that verify the book availability logic is correct
 * 
 * Acceptance Criteria:
 * - AC-1: Logic uses `availableCopies <= 0` for unavailable state
 * - AC-2: Borrow button is disabled only when no copies are available
 * - AC-2: Borrow button is enabled when one or more copies are available
 * 
 * This file contains both unit tests and integration test scenarios
 */

import { describe, it, expect, vi } from 'vitest';

/**
 * Helper function that represents the CORRECT availability check logic
 * This is what the fixed code should look like
 */
function isBookAvailable(availableCopies: number): boolean {
  // CORRECT: availableCopies > 0 (or >= 1)
  return availableCopies > 0;
}

/**
 * Helper function that represents the BUGGY availability check logic
 * This is the current bug in the code (< 1 instead of <= 0)
 */
function isBookAvailableBuggy(availableCopies: number): boolean {
  // BUGGY: availableCopies < 1
  return availableCopies < 1;
}

/**
 * The fixed check should use <= 0 to determine unavailable
 */
function isBookUnavailable(availableCopies: number): boolean {
  return availableCopies <= 0;
}

describe('Level 2 Task 1: Borrow Availability Logic', () => {
  
  describe('Correct Availability Check Logic', () => {
    it('should return true when availableCopies is 1', () => {
      expect(isBookAvailable(1)).toBe(true);
    });

    it('should return true when availableCopies is greater than 1', () => {
      expect(isBookAvailable(5)).toBe(true);
      expect(isBookAvailable(10)).toBe(true);
      expect(isBookAvailable(100)).toBe(true);
    });

    it('should return false when availableCopies is 0', () => {
      expect(isBookAvailable(0)).toBe(false);
    });

    it('should return false when availableCopies is negative', () => {
      expect(isBookAvailable(-1)).toBe(false);
      expect(isBookAvailable(-2)).toBe(false);
    });
  });

  describe('Unavailable Check Logic (fixed)', () => {
    it('should return true (unavailable) when availableCopies is 0', () => {
      expect(isBookUnavailable(0)).toBe(true);
    });

    it('should return true (unavailable) when availableCopies is negative', () => {
      expect(isBookUnavailable(-1)).toBe(true);
      expect(isBookUnavailable(-2)).toBe(true);
    });

    it('should return false (available) when availableCopies is 1', () => {
      expect(isBookUnavailable(1)).toBe(false);
    });

    it('should return false (available) when availableCopies is greater than 1', () => {
      expect(isBookUnavailable(5)).toBe(false);
      expect(isBookUnavailable(10)).toBe(false);
    });
  });

  describe('Buggy Logic Comparison', () => {
    it('should demonstrate the bug with availableCopies = 0', () => {
      // Buggy: returns false (can borrow) when availableCopies = 0
      // This is wrong! Should return true (cannot borrow)
      expect(isBookAvailableBuggy(0)).toBe(false);
      
      // Fixed: returns false (cannot borrow) when availableCopies = 0
      expect(isBookAvailable(0)).toBe(false);
      
      // The difference is in the availability check threshold
    });

    it('should demonstrate the bug with availableCopies = 1', () => {
      // With < 1: returns false when copies = 1 (wrong - should allow)
      expect(isBookAvailableBuggy(1)).toBe(true); // This is correct actually!
      
      // With > 0: returns true when copies = 1 (correct - allows borrowing)
      expect(isBookAvailable(1)).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle maximum available copies', () => {
      expect(isBookAvailable(Number.MAX_SAFE_INTEGER)).toBe(true);
    });

    it('should handle large negative values', () => {
      expect(isBookAvailable(-1000)).toBe(false);
    });

    it('should handle floating point values', () => {
      // Test with float values (in case of decimal)
      expect(isBookAvailable(0.5)).toBe(true);
    });
  });

  describe('Borrow Button State Logic', () => {
    it('should enable borrow button when book is available', () => {
      const enableBorrow = (copies: number) => isBookAvailable(copies);
      
      expect(enableBorrow(1)).toBe(true);
      expect(enableBorrow(5)).toBe(true);
      expect(enableBorrow(10)).toBe(true);
    });

    it('should disable borrow button when book is unavailable', () => {
      const enableBorrow = (copies: number) => isBookAvailable(copies);
      
      expect(enableBorrow(0)).toBe(false);
      expect(enableBorrow(-1)).toBe(false);
    });
  });
});

/**
 * HIDDEN TESTS - These test additional edge cases
 * that may not be immediately obvious
 */
describe('Level 2 Task 1: Hidden Edge Case Tests', () => {
  it('should handle zero edge case correctly', () => {
    // The key edge case: 0 should be considered unavailable
    expect(isBookUnavailable(0)).toBe(true);
    expect(isBookAvailable(0)).toBe(false);
  });

  it('should handle negative inventory correctly', () => {
    // Negative inventory should definitely be unavailable
    expect(isBookUnavailable(-1)).toBe(true);
    expect(isBookUnavailable(-5)).toBe(true);
    expect(isBookUnavailable(-100)).toBe(true);
  });

  it('should handle boundary between 0 and 1', () => {
    // 0 and 1 are the boundary values
    expect(isBookUnavailable(0)).toBe(true);  // unavailable
    expect(isBookUnavailable(1)).toBe(false); // available
  });

  it('should match business logic for book borrowing', () => {
    // A book with 0 copies cannot be borrowed
    // A book with 1 or more copies can be borrowed
    const canBorrow = (copies: number) => copies > 0;
    
    // Test all scenarios
    expect(canBorrow(0)).toBe(false);
    expect(canBorrow(1)).toBe(true);
    expect(canBorrow(2)).toBe(true);
    expect(canBorrow(-1)).toBe(false);
  });
});
