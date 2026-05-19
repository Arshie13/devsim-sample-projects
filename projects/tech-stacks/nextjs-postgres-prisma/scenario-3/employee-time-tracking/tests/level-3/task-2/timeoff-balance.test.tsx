import { describe, it, expect } from 'vitest';

// Candidate adds computeTimeOffBalance to: src/lib/timeoff.ts
const load = () => import('../../../src/lib/timeoff');

const requests = [
  { hours: 40, status: 'approved', request_type: 'vacation' },
  { hours: 8, status: 'approved', request_type: 'sick' },
  { hours: 16, status: 'pending', request_type: 'vacation' },
  { hours: 24, status: 'approved', request_type: 'unpaid' },  // unpaid — not counted
  { hours: 8, status: 'rejected', request_type: 'personal' }, // rejected — not counted
];

describe('L3T2: computeTimeOffBalance', () => {
  it('is exported as a function', async () => {
    const { computeTimeOffBalance } = await load();
    expect(typeof computeTimeOffBalance).toBe('function');
  });

  it('sums approved, non-unpaid hours as "used"', async () => {
    const { computeTimeOffBalance } = await load();
    expect(computeTimeOffBalance(120, requests).used).toBe(48);
  });

  it('sums pending hours separately', async () => {
    const { computeTimeOffBalance } = await load();
    expect(computeTimeOffBalance(120, requests).pending).toBe(16);
  });

  it('computes remaining as allowance minus used', async () => {
    const { computeTimeOffBalance } = await load();
    expect(computeTimeOffBalance(120, requests).remaining).toBe(72);
  });

  it('returns the full allowance when there are no requests', async () => {
    const { computeTimeOffBalance } = await load();
    expect(computeTimeOffBalance(120, [])).toEqual({ used: 0, pending: 0, remaining: 120 });
  });
});
