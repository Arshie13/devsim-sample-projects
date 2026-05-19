import { describe, it, expect } from 'vitest';

// Candidate adds buildOrderPayload to: src/lib/checkout.ts
const load = () => import('../../../src/lib/checkout');

const cart = [
  { product_id: 'p1', price: 100, cartQuantity: 2 }, // 200
  { product_id: 'p2', price: 50, cartQuantity: 1 },  // 50
];

describe('L3T2: buildOrderPayload', () => {
  it('is exported as a function', async () => {
    const { buildOrderPayload } = await load();
    expect(typeof buildOrderPayload).toBe('function');
  });

  it('passes the customer name through', async () => {
    const { buildOrderPayload } = await load();
    expect(buildOrderPayload(cart, 'Ada Lovelace').customer_name).toBe('Ada Lovelace');
  });

  it('builds one item per cart line with computed subtotal', async () => {
    const { buildOrderPayload } = await load();
    const { items } = buildOrderPayload(cart, 'Walk-in');
    expect(items).toHaveLength(2);
    expect(items[0]).toEqual({ product_id: 'p1', quantity: 2, unit_price: 100, subtotal: 200 });
  });

  it('totals to the subtotal when there is no coupon', async () => {
    const { buildOrderPayload } = await load();
    const payload = buildOrderPayload(cart, 'Walk-in');
    expect(payload.discount_amount).toBe(0);
    expect(payload.total_amount).toBe(250);
    expect(payload.coupon_id).toBeNull();
  });

  it('applies a coupon discount and records the coupon id', async () => {
    const { buildOrderPayload } = await load();
    const payload = buildOrderPayload(cart, 'Walk-in', { coupon_id: 'c1', discount_percent: 20 });
    expect(payload.discount_amount).toBe(50);
    expect(payload.total_amount).toBe(200);
    expect(payload.coupon_id).toBe('c1');
  });
});
