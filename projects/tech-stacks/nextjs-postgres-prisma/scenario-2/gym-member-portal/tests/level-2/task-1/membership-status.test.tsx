import { describe, it, expect } from 'vitest';

// Candidate creates: src/lib/membership.ts
const load = () => import('../../../src/lib/membership');

const now = new Date('2026-06-01T00:00:00Z');

describe('L2T1: getMembershipStatus', () => {
  it('is exported as a function', async () => {
    const { getMembershipStatus } = await load();
    expect(typeof getMembershipStatus).toBe('function');
  });

  it('returns "active" for an active membership within its date range', async () => {
    const { getMembershipStatus } = await load();
    const m = { status: 'active', start_date: '2026-01-01', end_date: '2026-12-31' };
    expect(getMembershipStatus(m, now)).toBe('active');
  });

  it('returns "expired" when now is past the end date', async () => {
    const { getMembershipStatus } = await load();
    const m = { status: 'active', start_date: '2025-01-01', end_date: '2025-12-31' };
    expect(getMembershipStatus(m, now)).toBe('expired');
  });

  it('returns "inactive" for a non-active status still within range', async () => {
    const { getMembershipStatus } = await load();
    const m = { status: 'frozen', start_date: '2026-01-01', end_date: '2026-12-31' };
    expect(getMembershipStatus(m, now)).toBe('inactive');
  });

  it('returns "inactive" before the membership has started', async () => {
    const { getMembershipStatus } = await load();
    const m = { status: 'active', start_date: '2026-07-01', end_date: '2026-12-31' };
    expect(getMembershipStatus(m, now)).toBe('inactive');
  });
});
