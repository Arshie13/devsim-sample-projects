import { describe, it, expect } from 'vitest';

// Candidate creates: src/lib/stats.ts
const load = () => import('../../../src/lib/stats');

const bookings = [
  { class_id: 3 },
  { class_id: 1 },
  { class_id: 3 },
  { class_id: 3 },
  { class_id: 1 },
];

describe('L4T1: countBookingsByClass', () => {
  it('is exported as a function', async () => {
    const { countBookingsByClass } = await load();
    expect(typeof countBookingsByClass).toBe('function');
  });

  it('counts bookings per class id', async () => {
    const { countBookingsByClass } = await load();
    expect(countBookingsByClass(bookings)).toEqual([
      { class_id: 1, count: 2 },
      { class_id: 3, count: 3 },
    ]);
  });

  it('sorts the result by class id ascending', async () => {
    const { countBookingsByClass } = await load();
    const result = countBookingsByClass(bookings);
    expect(result.map((r) => r.class_id)).toEqual([1, 3]);
  });

  it('returns an empty array for no bookings', async () => {
    const { countBookingsByClass } = await load();
    expect(countBookingsByClass([])).toEqual([]);
  });
});
