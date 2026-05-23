// @vitest-environment node

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Candidate creates: src/app/actions/cart.ts
//
// Must export an async server action:
//   getCartTotals(input: {
//     items: { product_id: string; cartQuantity: number }[];
//     discountPercent?: number;
//   }): Promise<{ subtotal: number; discount: number; total: number }>
//
// The action must look up product prices from Prisma — we mock @/lib/prisma
// so the test does not hit a real database. Money values must be rounded to
// two decimals.

const findMany = vi.fn();

vi.mock('@/lib/prisma', () => ({
  prisma: {
    product: {
      findMany,
    },
  },
}));

const load = () => import('../../../src/app/actions/cart');

describe('L2T2: getCartTotals (server action)', () => {
  beforeEach(() => {
    findMany.mockReset();
  });

  it('is exported as an async function', async () => {
    const mod = await load();
    expect(typeof mod.getCartTotals).toBe('function');
  });

  it('queries Prisma for the cart product ids', async () => {
    findMany.mockResolvedValue([
      { product_id: 'p1', price: 100 },
      { product_id: 'p2', price: 50 },
    ]);
    const { getCartTotals } = await load();
    await getCartTotals({
      items: [
        { product_id: 'p1', cartQuantity: 2 },
        { product_id: 'p2', cartQuantity: 3 },
      ],
    });
    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { product_id: { in: expect.arrayContaining(['p1', 'p2']) } },
      }),
    );
  });

  it('sums the subtotal from DB prices and cart quantities', async () => {
    findMany.mockResolvedValue([
      { product_id: 'p1', price: 100 },
      { product_id: 'p2', price: 50 },
    ]);
    const { getCartTotals } = await load();
    const result = await getCartTotals({
      items: [
        { product_id: 'p1', cartQuantity: 2 }, // 200
        { product_id: 'p2', cartQuantity: 3 }, // 150
      ],
    });
    expect(result.subtotal).toBe(350);
    expect(result.discount).toBe(0);
    expect(result.total).toBe(350);
  });

  it('applies a percentage discount', async () => {
    findMany.mockResolvedValue([{ product_id: 'p1', price: 100 }]);
    const { getCartTotals } = await load();
    const result = await getCartTotals({
      items: [{ product_id: 'p1', cartQuantity: 2 }],
      discountPercent: 10,
    });
    expect(result.subtotal).toBe(200);
    expect(result.discount).toBe(20);
    expect(result.total).toBe(180);
  });

  it('handles an empty cart without querying Prisma', async () => {
    const { getCartTotals } = await load();
    const result = await getCartTotals({ items: [] });
    expect(result).toEqual({ subtotal: 0, discount: 0, total: 0 });
  });

  it('rounds money values to two decimals', async () => {
    findMany.mockResolvedValue([{ product_id: 'p1', price: 9.99 }]);
    const { getCartTotals } = await load();
    const result = await getCartTotals({
      items: [{ product_id: 'p1', cartQuantity: 3 }],
      discountPercent: 15,
    });
    expect(result.subtotal).toBe(29.97);
    expect(result.discount).toBe(4.5);
    expect(result.total).toBe(25.47);
  });
});
