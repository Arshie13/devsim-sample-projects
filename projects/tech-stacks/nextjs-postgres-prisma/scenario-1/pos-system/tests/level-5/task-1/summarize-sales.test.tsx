import { describe, it, expect } from 'vitest';

// Candidate creates: src/lib/reports.ts
const load = () => import('../../../src/lib/reports');

const orders = [
  { total_amount: 100, discount_amount: 0 },
  { total_amount: 250, discount_amount: 50 },
  { total_amount: 400, discount_amount: 25 },
];

describe('L5T1: summarizeSales', () => {
  it('is exported as a function', async () => {
    const { summarizeSales } = await load();
    expect(typeof summarizeSales).toBe('function');
  });

  it('totals revenue, discount and order count', async () => {
    const { summarizeSales } = await load();
    const s = summarizeSales(orders);
    expect(s.totalRevenue).toBe(750);
    expect(s.totalDiscount).toBe(75);
    expect(s.orderCount).toBe(3);
  });

  it('computes the average order value rounded to two decimals', async () => {
    const { summarizeSales } = await load();
    expect(summarizeSales(orders).averageOrderValue).toBe(250);
    expect(summarizeSales([{ total_amount: 100, discount_amount: 0 }, { total_amount: 0, discount_amount: 0 }]).averageOrderValue).toBe(50);
  });

  it('returns zeroes for no orders (no division by zero)', async () => {
    const { summarizeSales } = await load();
    expect(summarizeSales([])).toEqual({
      totalRevenue: 0,
      totalDiscount: 0,
      orderCount: 0,
      averageOrderValue: 0,
    });
  });
});
