import { describe, it, expect } from 'vitest';

// Candidate creates: src/lib/time.ts
const load = () => import('../../../src/lib/time');

describe('L2T1: getEmployeeStatus', () => {
  it('is exported as a function', async () => {
    const { getEmployeeStatus } = await load();
    expect(typeof getEmployeeStatus).toBe('function');
  });

  it('returns "off" when there is no time entry', async () => {
    const { getEmployeeStatus } = await load();
    expect(getEmployeeStatus(null)).toBe('off');
  });

  it('returns "clocked-in" when the entry has no clock-out', async () => {
    const { getEmployeeStatus } = await load();
    expect(getEmployeeStatus({ clock_in: '2026-05-20T09:00:00Z', clock_out: null })).toBe('clocked-in');
  });

  it('returns "clocked-out" when the entry has a clock-out', async () => {
    const { getEmployeeStatus } = await load();
    expect(
      getEmployeeStatus({ clock_in: '2026-05-20T09:00:00Z', clock_out: '2026-05-20T17:00:00Z' }),
    ).toBe('clocked-out');
  });
});
