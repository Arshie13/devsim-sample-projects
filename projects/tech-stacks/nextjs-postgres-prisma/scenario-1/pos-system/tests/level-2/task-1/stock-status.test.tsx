// @vitest-environment node

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Candidate creates: src/lib/actions/inventory.ts
//
// Must export an async server action:
//   getStockStatusForProduct(productId: string):
//     Promise<{ productId: string; quantity: number; status: 'OUT_OF_STOCK' | 'LOW_STOCK' | 'IN_STOCK' }>
//
// The action must read from Prisma — we mock @/lib/prisma so the test does
// not hit a real database. The candidate should classify by quantity:
//   quantity <= 0 -> OUT_OF_STOCK
//   1..5          -> LOW_STOCK
//   > 5           -> IN_STOCK

const findUnique = vi.fn();

vi.mock('@/lib/prisma', () => ({
  prisma: {
    product: {
      findUnique,
    },
  },
}));

const load = () => import('../../../src/lib/actions/inventory');

describe('L2T1: getStockStatusForProduct (server action)', () => {
  beforeEach(() => {
    findUnique.mockReset();
  });

  it('is exported as an async function', async () => {
    const mod = await load();
    expect(typeof mod.getStockStatusForProduct).toBe('function');
  });

  it('queries Prisma by product_id', async () => {
    findUnique.mockResolvedValue({ product_id: 'p1', quantity: 10 });
    const { getStockStatusForProduct } = await load();
    await getStockStatusForProduct('p1');
    expect(findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { product_id: 'p1' } }),
    );
  });

  it('classifies zero/negative quantity as OUT_OF_STOCK', async () => {
    findUnique.mockResolvedValue({ product_id: 'p1', quantity: 0 });
    const { getStockStatusForProduct } = await load();
    const result = await getStockStatusForProduct('p1');
    expect(result.status).toBe('OUT_OF_STOCK');
  });

  it('classifies 1–5 quantity as LOW_STOCK', async () => {
    findUnique.mockResolvedValue({ product_id: 'p1', quantity: 3 });
    const { getStockStatusForProduct } = await load();
    const result = await getStockStatusForProduct('p1');
    expect(result.status).toBe('LOW_STOCK');
    expect(result.quantity).toBe(3);
  });

  it('classifies quantity above 5 as IN_STOCK', async () => {
    findUnique.mockResolvedValue({ product_id: 'p1', quantity: 42 });
    const { getStockStatusForProduct } = await load();
    const result = await getStockStatusForProduct('p1');
    expect(result.status).toBe('IN_STOCK');
  });

  it('throws when the product does not exist', async () => {
    findUnique.mockResolvedValue(null);
    const { getStockStatusForProduct } = await load();
    await expect(getStockStatusForProduct('ghost')).rejects.toThrow();
  });
});
