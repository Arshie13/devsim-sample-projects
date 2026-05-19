import { describe, it, expect } from 'vitest';

// Candidate adds buildDepartmentReport to: src/lib/payroll.ts
const load = () => import('../../../src/lib/payroll');

// Department is derived from first name, matching the dashboard's mapping:
//   Sarah / Robert -> Engineering, Michael -> Design, Emily -> Marketing,
//   James -> Sales, everyone else -> HR.
const employees = [
  { id: 1, first_name: 'Sarah', last_name: 'Johnson' },   // Engineering
  { id: 2, first_name: 'Robert', last_name: 'Taylor' },   // Engineering
  { id: 3, first_name: 'Michael', last_name: 'Chen' },    // Design
  { id: 4, first_name: 'Lisa', last_name: 'Anderson' },   // HR
];

const records = [
  { employee_id: 1, total_hours: 45, gross_pay: 3375 },
  { employee_id: 2, total_hours: 48, gross_pay: 4160 },
  { employee_id: 3, total_hours: 42, gross_pay: 2795 },
  { employee_id: 4, total_hours: 40, gross_pay: 2400 },
];

describe('L5T2: buildDepartmentReport', () => {
  it('is exported as a function', async () => {
    const { buildDepartmentReport } = await load();
    expect(typeof buildDepartmentReport).toBe('function');
  });

  it('groups payroll by department', async () => {
    const { buildDepartmentReport } = await load();
    const report = buildDepartmentReport(records, employees);
    const engineering = report.find((r) => r.department === 'Engineering');
    expect(engineering).toEqual({
      department: 'Engineering',
      headcount: 2,
      totalHours: 93,
      totalGross: 7535,
    });
  });

  it('sorts departments alphabetically', async () => {
    const { buildDepartmentReport } = await load();
    const report = buildDepartmentReport(records, employees);
    expect(report.map((r) => r.department)).toEqual(['Design', 'Engineering', 'HR']);
  });

  it('returns an empty array for no records', async () => {
    const { buildDepartmentReport } = await load();
    expect(buildDepartmentReport([], employees)).toEqual([]);
  });
});
