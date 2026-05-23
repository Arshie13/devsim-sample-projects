// @vitest-environment node

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Candidate creates: src/app/actions/payroll.ts
//
// Must export an async server action:
//   computeGrossPayForEmployee(
//     employeeId: number,
//     regularHours: number,
//     overtimeHours: number,
//   ): Promise<number>
//
// Looks up the employee's `hourly_rate` via Prisma (mocked) and returns:
//   gross = regular * rate + overtime * rate * 1.5
// rounded to two decimals. Throws when the employee has no hourly_rate.

const findUnique = vi.fn();

vi.mock('@/lib/prisma', () => ({
  prisma: {
    employee: {
      findUnique,
    },
  },
}));

const load = () => import('../../../src/app/actions/payroll');

describe('L4T2: computeGrossPayForEmployee (server action)', () => {
  beforeEach(() => {
    findUnique.mockReset();
  });

  it('is exported as an async function', async () => {
    const mod = await load();
    expect(typeof mod.computeGrossPayForEmployee).toBe('function');
  });

  it('queries Prisma for the employee', async () => {
    findUnique.mockResolvedValue({ hourly_rate: 25 });
    const { computeGrossPayForEmployee } = await load();
    await computeGrossPayForEmployee(7, 40, 0);
    expect(findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 7 } }),
    );
  });

  it('pays regular hours at the base rate', async () => {
    findUnique.mockResolvedValue({ hourly_rate: 25 });
    const { computeGrossPayForEmployee } = await load();
    expect(await computeGrossPayForEmployee(7, 40, 0)).toBe(1000);
  });

  it('pays overtime hours at 1.5× the base rate', async () => {
    findUnique.mockResolvedValue({ hourly_rate: 25 });
    const { computeGrossPayForEmployee } = await load();
    // 40 * 25 + 8 * 25 * 1.5 = 1000 + 300 = 1300
    expect(await computeGrossPayForEmployee(7, 40, 8)).toBe(1300);
  });

  it('rounds the result to two decimals', async () => {
    findUnique.mockResolvedValue({ hourly_rate: 18.33 });
    const { computeGrossPayForEmployee } = await load();
    // 40 * 18.33 + 2 * 18.33 * 1.5 = 733.2 + 54.99 = 788.19
    expect(await computeGrossPayForEmployee(7, 40, 2)).toBe(788.19);
  });

  it('throws when the employee has no hourly_rate', async () => {
    findUnique.mockResolvedValue({ hourly_rate: null });
    const { computeGrossPayForEmployee } = await load();
    await expect(computeGrossPayForEmployee(7, 40, 0)).rejects.toThrow();
  });
});
