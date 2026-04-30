import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import path from 'path';

const ROOT = path.resolve(__dirname, '../../../..');
const REVENUE_UTILS = path.resolve(ROOT, 'server/src/utils/revenueUtils.ts');
const POSTMORTEM = path.resolve(ROOT, 'server/POSTMORTEM_REVENUE.md');
const ORDERS_ROUTE = path.resolve(ROOT, 'server/src/routes/orders.ts');

describe('L5T2: Permanent Revenue Fix — Shared Utility + Postmortem', () => {
  // --- revenueUtils.ts ---
  it('server/src/utils/revenueUtils.ts file exists', () => {
    expect(existsSync(REVENUE_UTILS)).toBe(true);
  });

  it('revenueUtils.ts exports isRevenueEligibleOrder function', async () => {
    if (!existsSync(REVENUE_UTILS)) throw new Error('revenueUtils.ts missing');
    const mod = await import(REVENUE_UTILS);
    expect(mod.isRevenueEligibleOrder).toBeDefined();
    expect(typeof mod.isRevenueEligibleOrder).toBe('function');
  });

  it('isRevenueEligibleOrder returns false for order with cancelledAt set', async () => {
    if (!existsSync(REVENUE_UTILS)) throw new Error('revenueUtils.ts missing');
    const { isRevenueEligibleOrder } = await import(REVENUE_UTILS);
    const cancelledOrder = { cancelledAt: new Date('2025-01-01'), status: 'CANCELLED' };
    expect(isRevenueEligibleOrder(cancelledOrder)).toBe(false);
  });

  it('isRevenueEligibleOrder returns true for active order (cancelledAt === null)', async () => {
    if (!existsSync(REVENUE_UTILS)) throw new Error('revenueUtils.ts missing');
    const { isRevenueEligibleOrder } = await import(REVENUE_UTILS);
    const activeOrder = { cancelledAt: null, status: 'DELIVERED' };
    expect(isRevenueEligibleOrder(activeOrder)).toBe(true);
  });

  it('STALE-STATUS: isRevenueEligibleOrder returns false when cancelledAt is set but status is PENDING', async () => {
    if (!existsSync(REVENUE_UTILS)) throw new Error('revenueUtils.ts missing');
    const { isRevenueEligibleOrder } = await import(REVENUE_UTILS);
    // This is the stale-status scenario: admin accidentally changed status back to PENDING
    // but cancelledAt still has the cancellation timestamp — must be excluded
    const staleOrder = { cancelledAt: new Date('2025-01-01'), status: 'PENDING' };
    expect(isRevenueEligibleOrder(staleOrder)).toBe(false);
  });

  it('isRevenueEligibleOrder returns true for PENDING order with no cancelledAt', async () => {
    if (!existsSync(REVENUE_UTILS)) throw new Error('revenueUtils.ts missing');
    const { isRevenueEligibleOrder } = await import(REVENUE_UTILS);
    const pendingOrder = { cancelledAt: null, status: 'PENDING' };
    expect(isRevenueEligibleOrder(pendingOrder)).toBe(true);
  });

  // --- Stats endpoint uses shared utility ---
  it('orders.ts stats endpoint references revenueUtils or uses cancelledAt: null inline', () => {
    const content = readFileSync(ORDERS_ROUTE, 'utf-8');
    const usesUtil = /revenueUtils|isRevenueEligible/.test(content);
    const usesInline = /cancelledAt\s*:\s*null/.test(content);
    expect(usesUtil || usesInline).toBe(true);
  });

  // --- Postmortem ---
  it('server/POSTMORTEM_REVENUE.md file exists', () => {
    expect(existsSync(POSTMORTEM)).toBe(true);
  });

  it('Postmortem includes Symptom section', () => {
    if (!existsSync(POSTMORTEM)) throw new Error('POSTMORTEM_REVENUE.md missing');
    const content = readFileSync(POSTMORTEM, 'utf-8');
    expect(content).toMatch(/[Ss]ymptom/);
  });

  it('Postmortem includes Root Cause section', () => {
    if (!existsSync(POSTMORTEM)) throw new Error('POSTMORTEM_REVENUE.md missing');
    const content = readFileSync(POSTMORTEM, 'utf-8');
    expect(content).toMatch(/[Rr]oot\s+[Cc]ause/);
  });

  it('Postmortem includes Fix section', () => {
    if (!existsSync(POSTMORTEM)) throw new Error('POSTMORTEM_REVENUE.md missing');
    const content = readFileSync(POSTMORTEM, 'utf-8');
    expect(content).toMatch(/[Ff]ix/);
  });

  it('Postmortem includes Prevention section', () => {
    if (!existsSync(POSTMORTEM)) throw new Error('POSTMORTEM_REVENUE.md missing');
    const content = readFileSync(POSTMORTEM, 'utf-8');
    expect(content).toMatch(/[Pp]revention/);
  });
});
