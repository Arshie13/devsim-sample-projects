import { describe, it, expect } from 'vitest';

// Candidate creates: src/lib/payroll.ts (summarizePayroll)
const load = () => import('../../../src/lib/payroll');

const records = [
  { regular_hours: 40, overtime_hours: 5, total_hours: 45, gross_pay: 3375 },
  { regular_hours: 40, overtime_hours: 2, total_hours: 42, gross_pay: 2795 },
  { regular_hours: 38, overtime_hours: 0, total_hours: 38, gross_pay: 2280 },
];

describe('L5T1: summarizePayroll', () => {
  it('is exported as a function', async () => {
    const { summarizePayroll } = await load();
    expect(typeof summarizePayroll).toBe('function');
  });

  it('totals regular, overtime, hours and gross pay', async () => {
    const { summarizePayroll } = await load();
    const s = summarizePayroll(records);
    expect(s.totalRegular).toBe(118);
    expect(s.totalOvertime).toBe(7);
    expect(s.totalHours).toBe(125);
    expect(s.totalGross).toBe(8450);
  });

  it('computes the average gross pay rounded to two decimals', async () => {
    const { summarizePayroll } = await load();
    // 8450 / 3 = 2816.666... -> 2816.67
    expect(summarizePayroll(records).averageGross).toBe(2816.67);
  });

  it('returns zeroes for no records (no division by zero)', async () => {
    const { summarizePayroll } = await load();
    expect(summarizePayroll([])).toEqual({
      totalRegular: 0,
      totalOvertime: 0,
      totalHours: 0,
      totalGross: 0,
      averageGross: 0,
    });
  });
});
