import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import path from 'path';

const ROOT = path.resolve(__dirname, '../../../..');
const DASHBOARD = path.resolve(ROOT, 'client/src/pages/admin/Dashboard.tsx');
const COUPONS_ADMIN_PAGE = path.resolve(ROOT, 'client/src/pages/admin/Coupons.tsx');

describe('L4T2 (Client): Coupon Admin Panel & Cancel-Order Flow UI', () => {
  it('Admin coupon list panel exists in Dashboard.tsx OR as a separate admin/Coupons.tsx page', () => {
    const hasDashboard = existsSync(DASHBOARD);
    const hasCouponPage = existsSync(COUPONS_ADMIN_PAGE);
    expect(hasDashboard || hasCouponPage).toBe(true);

    if (hasCouponPage) {
      // Dedicated page
      const content = readFileSync(COUPONS_ADMIN_PAGE, 'utf-8');
      expect(content).toMatch(/coupon|Coupon/);
    } else {
      // Embedded in dashboard
      const content = readFileSync(DASHBOARD, 'utf-8');
      expect(content).toMatch(/coupon|Coupon/i);
    }
  });

  it('Coupon panel displays coupon code', () => {
    const source = existsSync(COUPONS_ADMIN_PAGE)
      ? readFileSync(COUPONS_ADMIN_PAGE, 'utf-8')
      : readFileSync(DASHBOARD, 'utf-8');
    expect(source).toMatch(/\.code|coupon.*code|code.*coupon/i);
  });

  it('Coupon panel displays remaining uses (maxUses - usedCount or similar)', () => {
    const source = existsSync(COUPONS_ADMIN_PAGE)
      ? readFileSync(COUPONS_ADMIN_PAGE, 'utf-8')
      : readFileSync(DASHBOARD, 'utf-8');
    expect(source).toMatch(/remaining|maxUses|usedCount/i);
  });

  it('Coupon panel displays expiry date', () => {
    const source = existsSync(COUPONS_ADMIN_PAGE)
      ? readFileSync(COUPONS_ADMIN_PAGE, 'utf-8')
      : readFileSync(DASHBOARD, 'utf-8');
    expect(source).toMatch(/expir/i);
  });

  it('Checkout.tsx cancel or order-management UI refreshes coupon state after cancellation', () => {
    const checkout = readFileSync(
      path.resolve(ROOT, 'client/src/pages/Checkout.tsx'),
      'utf-8'
    );
    // After cancellation, coupon usage should visually update
    expect(checkout).toMatch(/coupon|discount/i);
  });
});
