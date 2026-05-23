// @vitest-environment node

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Candidate creates: src/app/actions/time.ts (add to file from Task 2.1)
//
// Must export an async server action:
//   sumHoursForEmployee(employeeId: number): Promise<number>
//
// Reads all of the employee's time entries from Prisma (mocked) and sums
// the duration of COMPLETED entries (those with a clock_out). Returns the
// total hours as a number. Returns 0 when the employee has no entries.

const findMany = vi.fn();

vi.mock('@/lib/prisma', () => ({
  prisma: {
    timeEntry: {
      findMany,
    },
  },
}));

const load = () => import('../../../src/app/actions/time');

describe('L2T2: sumHoursForEmployee (server action)', () => {
  beforeEach(() => {
    findMany.mockReset();
  });

  it('is exported as an async function', async () => {
    const mod = await load();
    expect(typeof mod.sumHoursForEmployee).toBe('function');
  });

  it('queries Prisma by employee_id', async () => {
    findMany.mockResolvedValue([]);
    const { sumHoursForEmployee } = await load();
    await sumHoursForEmployee(7);
    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { employee_id: 7 } }),
    );
  });

  it('sums the duration of completed entries', async () => {
    findMany.mockResolvedValue([
      { clock_in: '2026-05-20T09:00:00Z', clock_out: '2026-05-20T17:00:00Z' }, // 8h
      { clock_in: '2026-05-20T08:00:00Z', clock_out: '2026-05-20T12:30:00Z' }, // 4.5h
    ]);
    const { sumHoursForEmployee } = await load();
    expect(await sumHoursForEmployee(7)).toBe(12.5);
  });

  it('ignores entries that have not been clocked out', async () => {
    findMany.mockResolvedValue([
      { clock_in: '2026-05-20T09:00:00Z', clock_out: '2026-05-20T17:00:00Z' }, // 8h
      { clock_in: '2026-05-20T09:00:00Z', clock_out: null },                   // ignored
    ]);
    const { sumHoursForEmployee } = await load();
    expect(await sumHoursForEmployee(7)).toBe(8);
  });

  it('returns zero when the employee has no entries', async () => {
    findMany.mockResolvedValue([]);
    const { sumHoursForEmployee } = await load();
    expect(await sumHoursForEmployee(7)).toBe(0);
  });
});
