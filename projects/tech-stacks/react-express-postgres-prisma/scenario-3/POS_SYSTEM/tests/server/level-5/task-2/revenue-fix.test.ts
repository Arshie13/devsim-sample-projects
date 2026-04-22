import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import path from 'path';

const ROOT = path.resolve(__dirname, '../../../..');
const REVENUE_UTILS = path.resolve(ROOT, 'server/src/utils/revenueUtils.ts');
const ORDERS_ROUTE = path.resolve(ROOT, 'server/src/routes/orders.ts');
const POSTMORTEM = path.resolve(ROOT, 'server/POSTMORTEM_REVENUE.md');

describe('L5T2: Permanent Fix + Centralization + Postmortem', () => {
  it('revenueUtils exports revenueWhereClause', async () => {
    const mod = await import(REVENUE_UTILS);
    expect(typeof mod.revenueWhereClause).toBe('function');
  });

  it('revenueWhereClause returns voidedAt: null predicate', async () => {
    const mod = await import(REVENUE_UTILS);
    const clause = mod.revenueWhereClause();
    expect(clause).toHaveProperty('voidedAt', null);
  });

  it('revenueWhereClause merges additional predicates', async () => {
    const mod = await import(REVENUE_UTILS);
    const clause = mod.revenueWhereClause({ createdAt: { gte: new Date(0) } });
    expect(clause).toHaveProperty('voidedAt', null);
    expect(clause).toHaveProperty('createdAt');
  });

  it('orders.ts imports revenueWhereClause from revenueUtils', () => {
    const content = readFileSync(ORDERS_ROUTE, 'utf-8');
    expect(content).toMatch(/from\s+['"][^'"]*revenueUtils['"]/);
    expect(content).toMatch(/revenueWhereClause/);
  });

  it('regression: stale-status voided order is excluded', async () => {
    const mod = await import(REVENUE_UTILS);
    const stale = { id: 99, status: 'COMPLETED', voidedAt: new Date() };
    expect(mod.isRevenueEligibleOrder(stale)).toBe(false);
  });

  it('POSTMORTEM_REVENUE.md exists', () => {
    expect(existsSync(POSTMORTEM)).toBe(true);
  });

  it('POSTMORTEM contains Symptom, Root Cause, Fix, Prevention sections', () => {
    const content = readFileSync(POSTMORTEM, 'utf-8');
    expect(content).toMatch(/##\s+Symptom/i);
    expect(content).toMatch(/##\s+Root Cause/i);
    expect(content).toMatch(/##\s+Fix/i);
    expect(content).toMatch(/##\s+Prevention/i);
  });
});
