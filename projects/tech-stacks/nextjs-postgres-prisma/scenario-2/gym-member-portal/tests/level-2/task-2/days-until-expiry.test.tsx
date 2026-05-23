// @vitest-environment node

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Candidate creates: src/app/actions/membership.ts (add to file from Task 2.1)
//
// Must export an async server action:
//   getDaysUntilExpiry(userId: string, now?: Date): Promise<number | null>
//
// Reads the user's latest membership end_date from Prisma (mocked) and returns
// the whole number of days remaining (floored). Returns null when no
// membership exists. Returns a negative number once expired.

const findFirst = vi.fn();

vi.mock('@/lib/prisma', () => ({
  prisma: {
    membership: {
      findFirst,
    },
  },
}));

const load = () => import('../../../src/app/actions/membership');

const now = new Date('2026-06-01T00:00:00Z');

describe('L2T2: getDaysUntilExpiry (server action)', () => {
  beforeEach(() => {
    findFirst.mockReset();
  });

  it('is exported as an async function', async () => {
    const mod = await load();
    expect(typeof mod.getDaysUntilExpiry).toBe('function');
  });

  it('queries Prisma by user_id', async () => {
    findFirst.mockResolvedValue(null);
    const { getDaysUntilExpiry } = await load();
    await getDaysUntilExpiry('u1', now);
    expect(findFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: { user_id: 'u1' } }),
    );
  });

  it('counts whole days until a future end date', async () => {
    findFirst.mockResolvedValue({ end_date: new Date('2026-06-04T00:00:00Z') });
    const { getDaysUntilExpiry } = await load();
    expect(await getDaysUntilExpiry('u1', now)).toBe(3);
  });

  it('floors a partial day', async () => {
    findFirst.mockResolvedValue({ end_date: new Date('2026-06-04T12:00:00Z') });
    const { getDaysUntilExpiry } = await load();
    expect(await getDaysUntilExpiry('u1', now)).toBe(3);
  });

  it('returns zero on the expiry day itself', async () => {
    findFirst.mockResolvedValue({ end_date: new Date('2026-06-01T00:00:00Z') });
    const { getDaysUntilExpiry } = await load();
    expect(await getDaysUntilExpiry('u1', now)).toBe(0);
  });

  it('returns a negative number once expired', async () => {
    findFirst.mockResolvedValue({ end_date: new Date('2026-05-30T00:00:00Z') });
    const { getDaysUntilExpiry } = await load();
    expect(await getDaysUntilExpiry('u1', now)).toBe(-2);
  });

  it('returns null when no membership exists', async () => {
    findFirst.mockResolvedValue(null);
    const { getDaysUntilExpiry } = await load();
    expect(await getDaysUntilExpiry('u1', now)).toBeNull();
  });
});
