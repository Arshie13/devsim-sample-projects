// @vitest-environment node

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Candidate creates: src/app/actions/reports.ts
//
// Must export an async server action:
//   getDepartmentReport(): Promise<{
//     department: string;
//     headcount: number;
//     totalHours: number;
//     totalGross: number;
//   }[]>
//
// Queries Prisma for every payroll record + the related employee:
//   prisma.payrollRecord.findMany({ include: { employee: true } })
//
// Department is derived from the employee's first_name (matching the
// dashboard's mapping):
//   Sarah / Robert -> Engineering
//   Michael       -> Design
//   Emily         -> Marketing
//   James         -> Sales
//   everyone else -> HR
//
// Aggregates per department:
//   - headcount  = count of distinct employee ids
//   - totalHours = Σ total_hours
//   - totalGross = Σ gross_pay
// Sorted alphabetically by department. Empty result when there are no records.

const findMany = vi.fn();

vi.mock('@/lib/prisma', () => ({
  prisma: {
    payrollRecord: {
      findMany,
    },
  },
}));

const load = () => import('../../../src/app/actions/reports');

const records = [
  { employee_id: 1, total_hours: 45, gross_pay: 3375,
    employee: { id: 1, first_name: 'Sarah', last_name: 'Johnson' } },   // Engineering
  { employee_id: 2, total_hours: 48, gross_pay: 4160,
    employee: { id: 2, first_name: 'Robert', last_name: 'Taylor' } },   // Engineering
  { employee_id: 3, total_hours: 42, gross_pay: 2795,
    employee: { id: 3, first_name: 'Michael', last_name: 'Chen' } },    // Design
  { employee_id: 4, total_hours: 40, gross_pay: 2400,
    employee: { id: 4, first_name: 'Lisa', last_name: 'Anderson' } },   // HR
];

describe('L5T2: getDepartmentReport (server action)', () => {
  beforeEach(() => {
    findMany.mockReset();
  });

  it('is exported as an async function', async () => {
    const mod = await load();
    expect(typeof mod.getDepartmentReport).toBe('function');
  });

  it('queries Prisma including the related employee', async () => {
    findMany.mockResolvedValue([]);
    const { getDepartmentReport } = await load();
    await getDepartmentReport();
    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        include: expect.objectContaining({ employee: expect.anything() }),
      }),
    );
  });

  it('groups payroll by department', async () => {
    findMany.mockResolvedValue(records);
    const { getDepartmentReport } = await load();
    const report = await getDepartmentReport();
    const engineering = report.find((r) => r.department === 'Engineering');
    expect(engineering).toEqual({
      department: 'Engineering',
      headcount: 2,
      totalHours: 93,
      totalGross: 7535,
    });
  });

  it('sorts departments alphabetically', async () => {
    findMany.mockResolvedValue(records);
    const { getDepartmentReport } = await load();
    const report = await getDepartmentReport();
    expect(report.map((r) => r.department)).toEqual(['Design', 'Engineering', 'HR']);
  });

  it('returns an empty array when Prisma returns no records', async () => {
    findMany.mockResolvedValue([]);
    const { getDepartmentReport } = await load();
    expect(await getDepartmentReport()).toEqual([]);
  });
});
