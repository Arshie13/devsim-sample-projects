import { describe, it, expect } from 'vitest';

// Candidate adds daysUntilExpiry to: src/lib/membership.ts
const load = () => import('../../../src/lib/membership');

const now = new Date('2026-06-01T00:00:00Z');

describe('L2T2: daysUntilExpiry', () => {
  it('is exported as a function', async () => {
    const { daysUntilExpiry } = await load();
    expect(typeof daysUntilExpiry).toBe('function');
  });

  it('counts whole days until a future end date', async () => {
    const { daysUntilExpiry } = await load();
    expect(daysUntilExpiry('2026-06-04T00:00:00Z', now)).toBe(3);
  });

  it('floors a partial day', async () => {
    const { daysUntilExpiry } = await load();
    expect(daysUntilExpiry('2026-06-04T12:00:00Z', now)).toBe(3);
  });

  it('returns zero on the expiry day itself', async () => {
    const { daysUntilExpiry } = await load();
    expect(daysUntilExpiry('2026-06-01T00:00:00Z', now)).toBe(0);
  });

  it('returns a negative number once expired', async () => {
    const { daysUntilExpiry } = await load();
    expect(daysUntilExpiry('2026-05-30T00:00:00Z', now)).toBe(-2);
  });
});
