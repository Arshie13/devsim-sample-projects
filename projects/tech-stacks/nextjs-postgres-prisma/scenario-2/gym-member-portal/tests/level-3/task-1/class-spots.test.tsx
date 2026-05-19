import { describe, it, expect } from 'vitest';

// Candidate creates: src/lib/classes.ts
const load = () => import('../../../src/lib/classes');

describe('L3T1: getAvailableSpots', () => {
  it('is exported as a function', async () => {
    const { getAvailableSpots } = await load();
    expect(typeof getAvailableSpots).toBe('function');
  });

  it('returns the remaining seats', async () => {
    const { getAvailableSpots } = await load();
    expect(getAvailableSpots(15, 4)).toBe(11);
  });

  it('never returns a negative number', async () => {
    const { getAvailableSpots } = await load();
    expect(getAvailableSpots(10, 14)).toBe(0);
  });
});

describe('L3T1: isClassFull', () => {
  it('is exported as a function', async () => {
    const { isClassFull } = await load();
    expect(typeof isClassFull).toBe('function');
  });

  it('is false while seats remain', async () => {
    const { isClassFull } = await load();
    expect(isClassFull(15, 14)).toBe(false);
  });

  it('is true at and beyond capacity', async () => {
    const { isClassFull } = await load();
    expect(isClassFull(15, 15)).toBe(true);
    expect(isClassFull(15, 16)).toBe(true);
  });
});
