// @vitest-environment node

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Candidate creates: src/lib/actions/membership.ts
//
// Must export an async server action:
//   getMembershipStatusForUser(userId: string, now?: Date):
//     Promise<'active' | 'expired' | 'inactive'>
//
// Reads the user's latest membership from Prisma (we mock the client) and
// classifies based on status + date range:
//   - status === 'active' AND now is within [start_date, end_date]  -> 'active'
//   - now is after end_date                                          -> 'expired'
//   - otherwise (non-active status, or before start_date)            -> 'inactive'
//   - no membership found                                            -> 'inactive'

const findFirst = vi.fn();

vi.mock('@/lib/prisma', () => ({
  prisma: {
    membership: {
      findFirst,
    },
  },
}));

const load = () => import('../../../src/lib/actions/membership');

const now = new Date('2026-06-01T00:00:00Z');

describe('L2T1: getMembershipStatusForUser (server action)', () => {
  beforeEach(() => {
    findFirst.mockReset();
  });

  it('is exported as an async function', async () => {
    const mod = await load();
    expect(typeof mod.getMembershipStatusForUser).toBe('function');
  });

  it('queries Prisma by user_id', async () => {
    findFirst.mockResolvedValue(null);
    const { getMembershipStatusForUser } = await load();
    await getMembershipStatusForUser('u1', now);
    expect(findFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: { user_id: 'u1' } }),
    );
  });

  it('returns "active" for an active membership inside its date range', async () => {
    findFirst.mockResolvedValue({
      status: 'active',
      start_date: new Date('2026-01-01'),
      end_date: new Date('2026-12-31'),
    });
    const { getMembershipStatusForUser } = await load();
    expect(await getMembershipStatusForUser('u1', now)).toBe('active');
  });

  it('returns "expired" when now is past the end date', async () => {
    findFirst.mockResolvedValue({
      status: 'active',
      start_date: new Date('2025-01-01'),
      end_date: new Date('2025-12-31'),
    });
    const { getMembershipStatusForUser } = await load();
    expect(await getMembershipStatusForUser('u1', now)).toBe('expired');
  });

  it('returns "inactive" for a non-active status still within range', async () => {
    findFirst.mockResolvedValue({
      status: 'frozen',
      start_date: new Date('2026-01-01'),
      end_date: new Date('2026-12-31'),
    });
    const { getMembershipStatusForUser } = await load();
    expect(await getMembershipStatusForUser('u1', now)).toBe('inactive');
  });

  it('returns "inactive" when no membership exists', async () => {
    findFirst.mockResolvedValue(null);
    const { getMembershipStatusForUser } = await load();
    expect(await getMembershipStatusForUser('u1', now)).toBe('inactive');
  });
});
