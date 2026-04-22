import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import path from 'path';

const ROOT = path.resolve(__dirname, '../../../..');
const ORDER_CONTROLLER = path.resolve(ROOT, 'server/src/controllers/order.controller.ts');
const SCHEMA = path.resolve(ROOT, 'server/prisma/schema.prisma');
const ORDERS_ROUTE = path.resolve(ROOT, 'server/src/routes/orders.ts');

describe('L3T2: Atomic Void + Oversell-Safe Checkout', () => {
  // --- Schema ---
  it('schema.prisma Order model has voidedAt DateTime? field', () => {
    const schema = readFileSync(SCHEMA, 'utf-8');
    expect(schema).toMatch(/voidedAt\s+DateTime\?/);
  });

  it('schema.prisma defines OrderStatus enum with COMPLETED and VOIDED', () => {
    const schema = readFileSync(SCHEMA, 'utf-8');
    expect(schema).toMatch(/enum\s+OrderStatus/);
    expect(schema).toContain('COMPLETED');
    expect(schema).toContain('VOIDED');
  });

  it('schema.prisma Order model has status field defaulting to COMPLETED', () => {
    const schema = readFileSync(SCHEMA, 'utf-8');
    expect(schema).toMatch(/status\s+OrderStatus/);
    expect(schema).toMatch(/@default\(COMPLETED\)/);
  });

  // --- Controller existence ---
  it('order.controller.ts exists', () => {
    expect(existsSync(ORDER_CONTROLLER)).toBe(true);
  });

  it('voidOrder is exported from order.controller.ts', async () => {
    if (!existsSync(ORDER_CONTROLLER)) throw new Error('order.controller.ts missing');
    const mod = await import(ORDER_CONTROLLER);
    expect(typeof mod.voidOrder).toBe('function');
  });

  // --- Atomicity checks (source analysis) ---
  it('voidOrder uses prisma.$transaction for atomicity', () => {
    const content = readFileSync(ORDER_CONTROLLER, 'utf-8');
    expect(content).toContain('$transaction');
  });

  it('voidOrder sets voidedAt timestamp', () => {
    const content = readFileSync(ORDER_CONTROLLER, 'utf-8');
    expect(content).toMatch(/voidedAt\s*:\s*new Date/);
  });

  it('voidOrder restores inventory via increment on each OrderItem', () => {
    const content = readFileSync(ORDER_CONTROLLER, 'utf-8');
    expect(content).toMatch(/increment/);
    expect(content).toMatch(/inventory/i);
  });

  it('voidOrder only allows voiding when status is COMPLETED', () => {
    const content = readFileSync(ORDER_CONTROLLER, 'utf-8');
    expect(content).toMatch(/COMPLETED/);
  });

  // --- Concurrency guard at checkout ---
  it('POST /api/orders checkout uses updateMany with stock guard (gte: quantity)', () => {
    const ordersRoute = readFileSync(ORDERS_ROUTE, 'utf-8');
    expect(ordersRoute).toMatch(/updateMany/);
    expect(ordersRoute).toMatch(/gte/);
  });

  it('POST /api/orders checkout rolls back when inventory guard fails (count check)', () => {
    const ordersRoute = readFileSync(ORDERS_ROUTE, 'utf-8');
    // After updateMany, the route must detect count !== 1 and throw
    expect(ordersRoute).toMatch(/\.count\s*!==?\s*1|\.count\s*<\s*1/);
  });
});
