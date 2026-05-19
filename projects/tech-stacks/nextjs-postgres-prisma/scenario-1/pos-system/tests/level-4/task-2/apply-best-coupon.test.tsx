import { describe, it, expect } from 'vitest';

// Candidate adds applyBestCoupon to: src/lib/coupon.ts
const load = () => import('../../../src/lib/coupon');

const now = new Date('2026-06-01T00:00:00Z');

const coupons = [
  { coupon_id: 'a', discount_percent: 10, is_active: true, expires_at: null },
  { coupon_id: 'b', discount_percent: 25, is_active: true, expires_at: null },
  { coupon_id: 'c', discount_percent: 50, is_active: false, expires_at: null },
  { coupon_id: 'd', discount_percent: 40, is_active: true, expires_at: '2026-05-01T00:00:00Z' },
];

describe('L4T2: applyBestCoupon', () => {
  it('is exported as a function', async () => {
    const { applyBestCoupon } = await load();
    expect(typeof applyBestCoupon).toBe('function');
  });

  it('picks the valid coupon giving the largest discount', async () => {
    const { applyBestCoupon } = await load();
    const result = applyBestCoupon(200, coupons, now);
    expect(result?.coupon.coupon_id).toBe('b');
    expect(result?.discount).toBe(50);
  });

  it('ignores inactive and expired coupons even if their percent is higher', async () => {
    const { applyBestCoupon } = await load();
    const result = applyBestCoupon(200, coupons, now);
    expect(result?.coupon.coupon_id).not.toBe('c');
    expect(result?.coupon.coupon_id).not.toBe('d');
  });

  it('returns null when no coupon is valid', async () => {
    const { applyBestCoupon } = await load();
    const result = applyBestCoupon(200, [coupons[2], coupons[3]], now);
    expect(result).toBeNull();
  });

  it('returns null for an empty coupon list', async () => {
    const { applyBestCoupon } = await load();
    expect(applyBestCoupon(200, [], now)).toBeNull();
  });
});
