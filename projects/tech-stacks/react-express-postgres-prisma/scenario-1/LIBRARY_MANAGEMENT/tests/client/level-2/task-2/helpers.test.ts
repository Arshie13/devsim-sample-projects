/**
 * Level 2 Task 2: Extract Availability Helper
 *
 * Acceptance Criteria:
 * - AC-1: Availability logic is extracted into a reusable helper
 * - AC-2: Borrow flow behavior remains correct after refactor
 */

/// <reference types="@testing-library/jest-dom" />

import { describe, expect, it } from 'vitest';

const loadHelpers = async () =>
  (await import('../../../../client/src/utils/helpers')) as Record<string, unknown>;

const getAvailabilityHelper = async () => {
  const helpersModule = await loadHelpers();
  const isBookAvailable = helpersModule.isBookAvailable;

  expect(typeof isBookAvailable).toBe('function');
  return isBookAvailable as (availableCopies: number) => boolean;
};

describe('Level 2 Task 2: Availability Helper Extraction', () => {
  describe('AC-1: Helper Extraction', () => {
    it('should export helper named isBookAvailable from client/src/utils/helpers.ts', async () => {
      const helpersModule = await loadHelpers();

      expect(helpersModule).toHaveProperty('isBookAvailable');
      expect(typeof helpersModule.isBookAvailable).toBe('function');
    });

    it('should make helper behavior explicit for copy-count input', async () => {
      const checkAvailability = await getAvailabilityHelper();

      expect(checkAvailability(3)).toBe(true);
      expect(checkAvailability(1)).toBe(true);
      expect(checkAvailability(0)).toBe(false);
      expect(checkAvailability(-1)).toBe(false);
    });

    it('should produce the same availability decisions expected by borrow flow', async () => {
      const checkAvailability = await getAvailabilityHelper();

      const bookAvailability = [2, 1, 0, -3].map((copies) => checkAvailability(copies));
      expect(bookAvailability).toEqual([true, true, false, false]);
    });
  });

  describe('AC-2: Behavior Preservation', () => {
    it('should keep only books with available copies as selectable', async () => {
      const checkAvailability = await getAvailabilityHelper();
      const books = [
        { id: 'a', availableCopies: 4 },
        { id: 'b', availableCopies: 1 },
        { id: 'c', availableCopies: 0 },
        { id: 'd', availableCopies: -1 },
      ];

      const selectableBookIds = books
        .filter((book) => checkAvailability(book.availableCopies))
        .map((book) => book.id);

      expect(selectableBookIds).toEqual(['a', 'b']);
    });

    it('should preserve output behavior consistently across repeated calls', async () => {
      const checkAvailability = await getAvailabilityHelper();

      expect(checkAvailability(1)).toBe(checkAvailability(1));
      expect(checkAvailability(0)).toBe(checkAvailability(0));
    });
  });
});

describe('Level 2 Task 2: Hidden Specificity Guards', () => {
  it('should fail when helper name does not match isBookAvailable', async () => {
    const helpersModule = await loadHelpers();
    expect(helpersModule).toHaveProperty('isBookAvailable');
  });

  it('should fail when helper output contract is violated', async () => {
    const checkAvailability = await getAvailabilityHelper();
    expect(checkAvailability(0)).toBe(false);
    expect(checkAvailability(2)).toBe(true);
  });
});
