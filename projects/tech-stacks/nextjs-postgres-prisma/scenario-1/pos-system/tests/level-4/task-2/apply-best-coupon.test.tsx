// @vitest-environment node

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Candidate creates: src/app/actions/coupons.ts
//
// Must export an async server action:
//   applyBestCoupon(subtotal: number, now?: Date):
//     Promise<{ coupon: { coupon_id: string; code: string; discount_percent: number };
//               discount: number } | null>
//
// The action queries Prisma for ACTIVE coupons (filtered at the DB layer) and
// picks the one yielding the largest discount on the given subtotal. Coupons
// whose expires_at is in the past must be ignored. Returns null when none
// qualify.

const findMany = vi.fn();

vi.mock('@/lib/prisma', () => ({
  prisma: {
    coupon: {
      findMany,
    },
  },
}));

const load = () => import('../../../src/app/actions/coupons');

const now = new Date('2026-06-01T00:00:00Z');

describe('L4T2: applyBestCoupon (server action)', () => {
  beforeEach(() => {
    findMany.mockReset();
  });

  it('is exported as an async function', async () => {
    const mod = await load();
    expect(typeof mod.applyBestCoupon).toBe('function');
  });

  it('queries Prisma for active coupons', async () => {
    findMany.mockResolvedValue([]);
    const { applyBestCoupon } = await load();
    await applyBestCoupon(200, now);
    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ is_active: true }),
      }),
    );
  });

  it('picks the coupon with the largest discount', async () => {
    findMany.mockResolvedValue([
      { coupon_id: 'a', code: 'A10', discount_percent: 10, is_active: true, expires_at: null },
      { coupon_id: 'b', code: 'B25', discount_percent: 25, is_active: true, expires_at: null },
    ]);
    const { applyBestCoupon } = await load();
    const result = await applyBestCoupon(200, now);
    expect(result?.coupon.coupon_id).toBe('b');
    expect(result?.discount).toBe(50);
  });

  it('ignores expired coupons even if their percent is higher', async () => {
    findMany.mockResolvedValue([
      { coupon_id: 'a', code: 'A10', discount_percent: 10, is_active: true, expires_at: null },
      { coupon_id: 'd', code: 'D40', discount_percent: 40, is_active: true, expires_at: new Date('2026-05-01T00:00:00Z') },
    ]);
    const { applyBestCoupon } = await load();
    const result = await applyBestCoupon(200, now);
    expect(result?.coupon.coupon_id).toBe('a');
    expect(result?.discount).toBe(20);
  });

  it('returns null when Prisma returns no active coupons', async () => {
    findMany.mockResolvedValue([]);
    const { applyBestCoupon } = await load();
    expect(await applyBestCoupon(200, now)).toBeNull();
  });

  it('returns null when every active coupon is expired', async () => {
    findMany.mockResolvedValue([
      { coupon_id: 'd', code: 'D40', discount_percent: 40, is_active: true, expires_at: new Date('2026-05-01T00:00:00Z') },
    ]);
    const { applyBestCoupon } = await load();
    expect(await applyBestCoupon(200, now)).toBeNull();
  });
});
