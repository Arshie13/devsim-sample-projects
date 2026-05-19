import { describe, it, expect } from 'vitest';

// Candidate creates: src/lib/checkout.ts
const load = () => import('../../../src/lib/checkout');

const products = [
  { product_id: 'p1', quantity: 10 },
  { product_id: 'p2', quantity: 3 },
];

describe('L3T1: validateCheckout', () => {
  it('is exported as a function', async () => {
    const { validateCheckout } = await load();
    expect(typeof validateCheckout).toBe('function');
  });

  it('rejects an empty cart', async () => {
    const { validateCheckout } = await load();
    const result = validateCheckout([], products);
    expect(result.ok).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('accepts a cart that is within stock', async () => {
    const { validateCheckout } = await load();
    const result = validateCheckout(
      [{ product_id: 'p1', cartQuantity: 2 }, { product_id: 'p2', cartQuantity: 3 }],
      products,
    );
    expect(result.ok).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('rejects an item whose quantity exceeds available stock', async () => {
    const { validateCheckout } = await load();
    const result = validateCheckout([{ product_id: 'p2', cartQuantity: 4 }], products);
    expect(result.ok).toBe(false);
    expect(result.errors.some((e) => e.includes('p2'))).toBe(true);
  });

  it('rejects a non-positive quantity', async () => {
    const { validateCheckout } = await load();
    expect(validateCheckout([{ product_id: 'p1', cartQuantity: 0 }], products).ok).toBe(false);
  });

  it('rejects an item that does not exist in the product list', async () => {
    const { validateCheckout } = await load();
    expect(validateCheckout([{ product_id: 'ghost', cartQuantity: 1 }], products).ok).toBe(false);
  });
});
