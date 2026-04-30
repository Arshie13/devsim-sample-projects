import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import path from 'path';

const ROOT = path.resolve(__dirname, '../../../..');
const ORDERS_ROUTE = path.resolve(ROOT, 'server/src/routes/orders.ts');
const REVENUE_UTILS = path.resolve(ROOT, 'server/src/utils/revenueUtils.ts');

describe('L5T1: Stabilize Revenue Classification', () => {
  it('revenueUtils.ts exists', () => {
    expect(existsSync(REVENUE_UTILS)).toBe(true);
  });

  it('exports isRevenueEligibleOrder', async () => {
    const mod = await import(REVENUE_UTILS);
    expect(typeof mod.isRevenueEligibleOrder).toBe('function');
  });

  it('isRevenueEligibleOrder excludes stale-status voided orders', async () => {
    const mod = await import(REVENUE_UTILS);
    const staleVoided = { id: 1, status: 'COMPLETED', voidedAt: new Date() };
    const completed = { id: 2, status: 'COMPLETED', voidedAt: null };
    const voided = { id: 3, status: 'VOIDED', voidedAt: new Date() };
    expect(mod.isRevenueEligibleOrder(staleVoided)).toBe(false);
    expect(mod.isRevenueEligibleOrder(completed)).toBe(true);
    expect(mod.isRevenueEligibleOrder(voided)).toBe(false);
  });

  it('daily revenue query filters by voidedAt: null (not status)', () => {
    const content = readFileSync(ORDERS_ROUTE, 'utf-8');
    expect(content).toMatch(/voidedAt\s*:\s*null/);
  });

  it('daily revenue query does NOT rely solely on status-based filtering', () => {
    const content = readFileSync(ORDERS_ROUTE, 'utf-8');
    // status === 'COMPLETED' as the revenue filter is the bug we're fixing
    expect(content).not.toMatch(/status\s*:\s*['"]COMPLETED['"]\s*,\s*\/\/\s*revenue/);
  });
});
