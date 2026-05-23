// @vitest-environment node

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Candidate creates: src/app/actions/time.ts
//
// Must export an async server action:
//   getEmployeeStatusForId(employeeId: number):
//     Promise<'off' | 'clocked-in' | 'clocked-out'>
//
// Looks up the employee's most recent time entry from Prisma (mocked) and
// classifies based on clock_out:
//   - no entry        -> 'off'
//   - clock_out null  -> 'clocked-in'
//   - clock_out set   -> 'clocked-out'

const findFirst = vi.fn();

vi.mock('@/lib/prisma', () => ({
  prisma: {
    timeEntry: {
      findFirst,
    },
  },
}));

const load = () => import('../../../src/app/actions/time');

describe('L2T1: getEmployeeStatusForId (server action)', () => {
  beforeEach(() => {
    findFirst.mockReset();
  });

  it('is exported as an async function', async () => {
    const mod = await load();
    expect(typeof mod.getEmployeeStatusForId).toBe('function');
  });

  it('queries Prisma by employee_id', async () => {
    findFirst.mockResolvedValue(null);
    const { getEmployeeStatusForId } = await load();
    await getEmployeeStatusForId(7);
    expect(findFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: { employee_id: 7 } }),
    );
  });

  it('returns "off" when there is no time entry', async () => {
    findFirst.mockResolvedValue(null);
    const { getEmployeeStatusForId } = await load();
    expect(await getEmployeeStatusForId(7)).toBe('off');
  });

  it('returns "clocked-in" when the entry has no clock_out', async () => {
    findFirst.mockResolvedValue({
      clock_in: '2026-05-20T09:00:00Z',
      clock_out: null,
    });
    const { getEmployeeStatusForId } = await load();
    expect(await getEmployeeStatusForId(7)).toBe('clocked-in');
  });

  it('returns "clocked-out" when the entry has a clock_out', async () => {
    findFirst.mockResolvedValue({
      clock_in: '2026-05-20T09:00:00Z',
      clock_out: '2026-05-20T17:00:00Z',
    });
    const { getEmployeeStatusForId } = await load();
    expect(await getEmployeeStatusForId(7)).toBe('clocked-out');
  });
});
