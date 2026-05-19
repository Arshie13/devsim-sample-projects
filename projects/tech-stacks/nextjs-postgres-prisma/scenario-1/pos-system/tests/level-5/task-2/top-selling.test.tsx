import { describe, it, expect } from 'vitest';

// Candidate adds topSellingProducts to: src/lib/reports.ts
const load = () => import('../../../src/lib/reports');

const orderItems = [
  { product_id: 'p1', product_name: 'Espresso', quantity: 5, subtotal: 600 },
  { product_id: 'p2', product_name: 'Latte', quantity: 8, subtotal: 1200 },
  { product_id: 'p1', product_name: 'Espresso', quantity: 3, subtotal: 360 },
  { product_id: 'p3', product_name: 'Muffin', quantity: 8, subtotal: 760 },
];

describe('L5T2: topSellingProducts', () => {
  it('is exported as a function', async () => {
    const { topSellingProducts } = await load();
    expect(typeof topSellingProducts).toBe('function');
  });

  it('aggregates units sold and revenue per product', async () => {
    const { topSellingProducts } = await load();
    const top = topSellingProducts(orderItems, 10);
    const p1 = top.find((p) => p.product_id === 'p1');
    expect(p1).toEqual({ product_id: 'p1', product_name: 'Espresso', unitsSold: 8, revenue: 960 });
  });

  it('sorts by units sold descending, breaking ties by revenue', async () => {
    const { topSellingProducts } = await load();
    const top = topSellingProducts(orderItems, 10);
    // p2 and p3 both sold 8 — p2 has higher revenue so it ranks first.
    expect(top[0].product_id).toBe('p2');
    expect(top[1].product_id).toBe('p3');
    expect(top[2].product_id).toBe('p1');
  });

  it('respects the limit', async () => {
    const { topSellingProducts } = await load();
    expect(topSellingProducts(orderItems, 2)).toHaveLength(2);
  });

  it('returns an empty array for no items', async () => {
    const { topSellingProducts } = await load();
    expect(topSellingProducts([], 5)).toEqual([]);
  });
});
