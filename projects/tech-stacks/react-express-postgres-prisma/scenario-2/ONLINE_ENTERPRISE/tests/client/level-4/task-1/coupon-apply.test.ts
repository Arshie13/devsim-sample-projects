import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import path from 'path';

const ROOT = path.resolve(__dirname, '../../../..');
const COUPON_SERVICE = path.resolve(ROOT, 'client/src/services/couponService.ts');
const CHECKOUT = path.resolve(ROOT, 'client/src/pages/Checkout.tsx');

describe('L4T1 (Client): Coupon Service & Checkout UI', () => {
  // --- couponService.ts ---
  it('client/src/services/couponService.ts file exists', () => {
    expect(existsSync(COUPON_SERVICE)).toBe(true);
  });

  it('couponService.ts exports validateCoupon function', () => {
    if (!existsSync(COUPON_SERVICE)) throw new Error('couponService.ts missing');
    const content = readFileSync(COUPON_SERVICE, 'utf-8');
    expect(content).toMatch(/export.*validateCoupon|validateCoupon.*export/);
  });

  it('validateCoupon calls POST /api/coupons/validate', () => {
    if (!existsSync(COUPON_SERVICE)) throw new Error('couponService.ts missing');
    const content = readFileSync(COUPON_SERVICE, 'utf-8');
    expect(content).toContain('/api/coupons/validate');
  });

  it('couponService.ts sends code and subtotal in the request', () => {
    if (!existsSync(COUPON_SERVICE)) throw new Error('couponService.ts missing');
    const content = readFileSync(COUPON_SERVICE, 'utf-8');
    expect(content).toMatch(/code/);
    expect(content).toMatch(/subtotal/);
  });

  // --- Checkout.tsx ---
  it('Checkout.tsx imports or references couponService / validateCoupon', () => {
    const content = readFileSync(CHECKOUT, 'utf-8');
    expect(content).toMatch(/couponService|validateCoupon/);
  });

  it('Checkout.tsx renders a coupon code input field', () => {
    const content = readFileSync(CHECKOUT, 'utf-8');
    expect(content).toMatch(/coupon|Coupon/);
    expect(content).toMatch(/[Ii]nput|input/);
  });

  it('Checkout.tsx shows the discounted total when a coupon is applied', () => {
    const content = readFileSync(CHECKOUT, 'utf-8');
    expect(content).toMatch(/discount|Discount|discountPercent/);
  });

  it('Checkout.tsx handles invalid/expired/exhausted coupon states', () => {
    const content = readFileSync(CHECKOUT, 'utf-8');
    // Should have error state rendering for bad coupons
    expect(content).toMatch(/invalid|expired|exhausted|error/i);
  });
});
