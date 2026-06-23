// @vitest-environment node

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Candidate creates: src/lib/actions/reports.ts
//
// Must export an async server action:
//   getTopSellingProducts(limit: number): Promise<{
//     product_id: string;
//     product_name: string;
//     unitsSold: number;
//     revenue: number;
//   }[]>
//
// Reads order items + their related product from Prisma (mocked) and
// aggregates per product_id:
//   - unitsSold = Σ quantity
//   - revenue   = Σ subtotal
// Sort by unitsSold descending, breaking ties by revenue descending.
// Return the first `limit` entries.

const findMany = vi.fn();

vi.mock('@/lib/prisma', () => ({
  prisma: {
    orderItem: {
      findMany,
    },
  },
}));

const load = () => import('../../../src/lib/actions/reports');

const items = [
  { product_id: 'p1', quantity: 5, subtotal: 600, product: { product_name: 'Espresso' } },
  { product_id: 'p2', quantity: 8, subtotal: 1200, product: { product_name: 'Latte' } },
  { product_id: 'p1', quantity: 1, subtotal: 120, product: { product_name: 'Espresso' } },
  { product_id: 'p3', quantity: 8, subtotal: 760, product: { product_name: 'Muffin' } },
];

describe('L5T2: getTopSellingProducts (server action)', () => {
  beforeEach(() => {
    findMany.mockReset();
  });

  it('is exported as an async function', async () => {
    const mod = await load();
    expect(typeof mod.getTopSellingProducts).toBe('function');
  });

  it('queries Prisma including the related product', async () => {
    findMany.mockResolvedValue([]);
    const { getTopSellingProducts } = await load();
    await getTopSellingProducts(10);
    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        include: expect.objectContaining({ product: expect.anything() }),
      }),
    );
  });

  it('aggregates units sold and revenue per product', async () => {
    findMany.mockResolvedValue(items);
    const { getTopSellingProducts } = await load();
    const top = await getTopSellingProducts(10);
    const p1 = top.find((p) => p.product_id === 'p1');
    expect(p1).toEqual({ product_id: 'p1', product_name: 'Espresso', unitsSold: 6, revenue: 720 });
  });

  it('sorts by units sold descending, breaking ties by revenue', async () => {
    findMany.mockResolvedValue(items);
    const { getTopSellingProducts } = await load();
    const top = await getTopSellingProducts(10);
    // p2 and p3 both sold 8 — p2 has higher revenue so it ranks first.
    expect(top[0].product_id).toBe('p2');
    expect(top[1].product_id).toBe('p3');
    expect(top[2].product_id).toBe('p1');
  });

  it('respects the limit', async () => {
    findMany.mockResolvedValue(items);
    const { getTopSellingProducts } = await load();
    expect(await getTopSellingProducts(2)).toHaveLength(2);
  });

  it('returns an empty array when Prisma returns no items', async () => {
    findMany.mockResolvedValue([]);
    const { getTopSellingProducts } = await load();
    expect(await getTopSellingProducts(5)).toEqual([]);
  });
});
