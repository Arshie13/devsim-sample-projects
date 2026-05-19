import { describe, it, expect } from 'vitest';

// Candidate adds canBookClass to: src/lib/classes.ts
const load = () => import('../../../src/lib/classes');

describe('L3T2: canBookClass', () => {
  it('is exported as a function', async () => {
    const { canBookClass } = await load();
    expect(typeof canBookClass).toBe('function');
  });

  it('allows booking a class with free seats the user has not booked', async () => {
    const { canBookClass } = await load();
    expect(canBookClass(3, 20, 5, [1, 2])).toEqual({ allowed: true, reason: '' });
  });

  it('blocks a class the user has already booked', async () => {
    const { canBookClass } = await load();
    const result = canBookClass(2, 20, 5, [1, 2]);
    expect(result.allowed).toBe(false);
    expect(result.reason).toMatch(/already booked/i);
  });

  it('blocks a class that is full', async () => {
    const { canBookClass } = await load();
    const result = canBookClass(3, 20, 20, [1, 2]);
    expect(result.allowed).toBe(false);
    expect(result.reason).toMatch(/full/i);
  });

  it('reports the already-booked reason before the full reason', async () => {
    const { canBookClass } = await load();
    // Class 2 is both already booked AND full — already-booked wins.
    const result = canBookClass(2, 20, 20, [2]);
    expect(result.reason).toMatch(/already booked/i);
  });
});
