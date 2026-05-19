import { describe, it, expect } from 'vitest';

// Candidate creates: src/lib/cart.ts
const load = () => import('../../../src/lib/cart');

const items = [
  { price: 100, cartQuantity: 2 }, // 200
  { price: 50, cartQuantity: 3 },  // 150
];

describe('L2T2: calculateCartTotals', () => {
  it('is exported as a function', async () => {
    const { calculateCartTotals } = await load();
    expect(typeof calculateCartTotals).toBe('function');
  });

  it('sums the subtotal across line items', async () => {
    const { calculateCartTotals } = await load();
    expect(calculateCartTotals(items).subtotal).toBe(350);
  });

  it('returns zero discount when no coupon percent is given', async () => {
    const { calculateCartTotals } = await load();
    const result = calculateCartTotals(items);
    expect(result.discount).toBe(0);
    expect(result.total).toBe(350);
  });

  it('applies a percentage discount', async () => {
    const { calculateCartTotals } = await load();
    const result = calculateCartTotals(items, 10);
    expect(result.discount).toBe(35);
    expect(result.total).toBe(315);
  });

  it('handles an empty cart', async () => {
    const { calculateCartTotals } = await load();
    expect(calculateCartTotals([])).toEqual({ subtotal: 0, discount: 0, total: 0 });
  });

  it('rounds money values to two decimals', async () => {
    const { calculateCartTotals } = await load();
    const result = calculateCartTotals([{ price: 9.99, cartQuantity: 3 }], 15);
    expect(result.subtotal).toBe(29.97);
    expect(result.discount).toBe(4.5);
    expect(result.total).toBe(25.47);
  });
});
