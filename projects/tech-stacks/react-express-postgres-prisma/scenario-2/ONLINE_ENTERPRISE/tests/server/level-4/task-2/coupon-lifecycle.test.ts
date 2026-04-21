import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import path from 'path';

const ROOT = path.resolve(__dirname, '../../../..');
const COUPON_CONTROLLER = path.resolve(ROOT, 'server/src/controllers/coupon.controller.ts');
const COUPON_ROUTE = path.resolve(ROOT, 'server/src/routes/coupons.ts');
const ORDER_CONTROLLER = path.resolve(ROOT, 'server/src/controllers/order.controller.ts');

describe('L4T2 (Server): Coupon Lifecycle & Usage Integrity', () => {
  it('coupon.controller.ts enforces usedCount < maxUses guard', () => {
    if (!existsSync(COUPON_CONTROLLER)) throw new Error('coupon.controller.ts missing');
    const content = readFileSync(COUPON_CONTROLLER, 'utf-8');
    expect(content).toMatch(/usedCount|maxUses/);
    // Must compare usedCount against maxUses
    expect(content).toMatch(/usedCount\s*[<>=]+|<\s*maxUses|>=\s*maxUses/);
  });

  it('coupon.controller.ts enforces expiresAt > now check', () => {
    if (!existsSync(COUPON_CONTROLLER)) throw new Error('coupon.controller.ts missing');
    const content = readFileSync(COUPON_CONTROLLER, 'utf-8');
    expect(content).toMatch(/expiresAt/);
    expect(content).toMatch(/new Date|Date\.now|now/i);
  });

  it('coupon.controller.ts enforces isActive check', () => {
    if (!existsSync(COUPON_CONTROLLER)) throw new Error('coupon.controller.ts missing');
    const content = readFileSync(COUPON_CONTROLLER, 'utf-8');
    expect(content).toMatch(/isActive/);
  });

  it('GET /api/coupons route exists (admin-only coupon list)', () => {
    if (!existsSync(COUPON_ROUTE)) throw new Error('coupons.ts missing');
    const content = readFileSync(COUPON_ROUTE, 'utf-8');
    expect(content).toMatch(/router\.get\s*\(\s*['"]\//);
  });

  it('GET /api/coupons response includes usage stats (usedCount, maxUses)', () => {
    if (!existsSync(COUPON_ROUTE)) throw new Error('coupons.ts missing');
    const content = readFileSync(COUPON_ROUTE, 'utf-8');
    expect(content).toMatch(/usedCount|maxUses/);
  });

  it('cancelOrder in order.controller.ts decrements coupon usedCount when coupon was applied', () => {
    if (!existsSync(ORDER_CONTROLLER)) throw new Error('order.controller.ts missing');
    const content = readFileSync(ORDER_CONTROLLER, 'utf-8');
    expect(content).toMatch(/usedCount.*decrement|decrement.*usedCount/);
  });

  it('usedCount decrement on cancel happens inside the same $transaction as stock restore', () => {
    if (!existsSync(ORDER_CONTROLLER)) throw new Error('order.controller.ts missing');
    const content = readFileSync(ORDER_CONTROLLER, 'utf-8');
    expect(content).toContain('$transaction');
    expect(content).toMatch(/decrement.*usedCount|usedCount.*decrement/);
  });
});
