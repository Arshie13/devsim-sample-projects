/**
 * Level 2 Task 1: Borrow Availability Helper Contract
 *
 * Output-first contract for availability checks:
 * - Unavailable when availableCopies <= 0
 * - Available when availableCopies > 0
 */

import { describe, expect, it } from 'vitest';

const loadHelpersModule = async () =>
  (await import('../../../../client/src/utils/helpers')) as Record<string, unknown>;

const getAvailabilityCheck = async () => {
  const module = await loadHelpersModule();
  const isBookAvailable = module.isBookAvailable;

  expect(typeof isBookAvailable).toBe('function');
  return isBookAvailable as (availableCopies: number) => boolean;
};

describe('Level 2 Task 1: Borrow Availability Helper', () => {
  describe('AC-1: Availability Helper Contract', () => {
    it('should export isBookAvailable from client/src/utils/helpers.ts', async () => {
      const module = await loadHelpersModule();

      expect(module).toHaveProperty('isBookAvailable');
      expect(typeof module.isBookAvailable).toBe('function');
    });

    it('should return false when availableCopies is 0 or negative', async () => {
      const isBookAvailable = await getAvailabilityCheck();

      expect(isBookAvailable(0)).toBe(false);
      expect(isBookAvailable(-1)).toBe(false);
    });

    it('should return true when availableCopies is positive', async () => {
      const isBookAvailable = await getAvailabilityCheck();

      expect(isBookAvailable(1)).toBe(true);
      expect(isBookAvailable(2)).toBe(true);
    });
  });

  describe('AC-2: Borrow Decision Consistency', () => {
    it('should keep decisions consistent across a mixed list', async () => {
      const isBookAvailable = await getAvailabilityCheck();
      const copies = [3, 1, 0, -2];

      const availabilityStates = copies.map((value) => isBookAvailable(value));
      expect(availabilityStates).toEqual([true, true, false, false]);
    });

    it('should produce the same output for repeated calls', async () => {
      const isBookAvailable = await getAvailabilityCheck();

      expect(isBookAvailable(0)).toBe(isBookAvailable(0));
      expect(isBookAvailable(1)).toBe(isBookAvailable(1));
    });
  });
});

describe('Level 2 Task 1: Hidden Contract Guards', () => {
  it('should keep the exact boundary between 0 and positive values', async () => {
    const isBookAvailable = await getAvailabilityCheck();

    expect(isBookAvailable(0)).toBe(false);
    expect(isBookAvailable(Number.EPSILON)).toBe(true);
  });

  it('should treat tiny positive values as available', async () => {
    const isBookAvailable = await getAvailabilityCheck();

    expect(isBookAvailable(0.0001)).toBe(true);
  });

  it('should keep results deterministic for repeated boundary checks', async () => {
    const isBookAvailable = await getAvailabilityCheck();

    expect(isBookAvailable(-5)).toBe(isBookAvailable(-5));
    expect(isBookAvailable(5)).toBe(isBookAvailable(5));
  });
});
