import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import path from 'path';

const ROOT = path.resolve(__dirname, '../../../..');
const COUPON_CONTROLLER = path.resolve(ROOT, 'server/src/controllers/coupon.controller.ts');
const COUPON_ROUTE = path.resolve(ROOT, 'server/src/routes/coupons.ts');
const SCHEMA = path.resolve(ROOT, 'server/prisma/schema.prisma');

describe('L4T1 (Server): Coupon Validate & Apply Endpoint', () => {
  // --- Schema ---
  it('schema.prisma contains model Coupon', () => {
    const schema = readFileSync(SCHEMA, 'utf-8');
    expect(schema).toContain('model Coupon');
  });

  it('Coupon model has all required fields', () => {
    const schema = readFileSync(SCHEMA, 'utf-8');
    expect(schema).toContain('code');
    expect(schema).toContain('discountPercent');
    expect(schema).toContain('maxUses');
    expect(schema).toContain('usedCount');
    expect(schema).toContain('expiresAt');
    expect(schema).toContain('isActive');
  });

  // --- Controller ---
  it('coupon.controller.ts file exists', () => {
    expect(existsSync(COUPON_CONTROLLER)).toBe(true);
  });

  it('coupon.controller.ts exports a validateCoupon (or validateCouponCode) function', async () => {
    if (!existsSync(COUPON_CONTROLLER)) throw new Error('coupon.controller.ts missing');
    const mod = await import(COUPON_CONTROLLER);
    const fn = mod.validateCoupon ?? mod.validateCouponCode;
    expect(fn).toBeDefined();
    expect(typeof fn).toBe('function');
  });

  // --- Route ---
  it('server/src/routes/coupons.ts file exists', () => {
    expect(existsSync(COUPON_ROUTE)).toBe(true);
  });

  it('coupons.ts registers POST /validate route', () => {
    if (!existsSync(COUPON_ROUTE)) throw new Error('coupons.ts missing');
    const content = readFileSync(COUPON_ROUTE, 'utf-8');
    expect(content).toMatch(/post.*validate|validate.*post/i);
  });

  it('POST /api/orders accepts optional couponCode in body', () => {
    const ordersRoute = readFileSync(
      path.resolve(ROOT, 'server/src/routes/orders.ts'),
      'utf-8'
    );
    expect(ordersRoute).toMatch(/couponCode/);
  });

  it('Order creation increments coupon usedCount when coupon is applied', () => {
    const ordersRoute = readFileSync(
      path.resolve(ROOT, 'server/src/routes/orders.ts'),
      'utf-8'
    );
    expect(ordersRoute).toMatch(/usedCount.*increment|increment.*usedCount/);
  });
});
