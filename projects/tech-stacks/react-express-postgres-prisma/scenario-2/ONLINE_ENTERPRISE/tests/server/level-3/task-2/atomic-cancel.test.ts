import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import path from 'path';

const ROOT = path.resolve(__dirname, '../../../..');
const ORDER_CONTROLLER = path.resolve(ROOT, 'server/src/controllers/order.controller.ts');
const SCHEMA = path.resolve(ROOT, 'server/prisma/schema.prisma');

describe('L3T2: Atomic Order Cancellation + Concurrency Guard', () => {
  // --- Schema ---
  it('schema.prisma Order model has cancelledAt DateTime? field', () => {
    const schema = readFileSync(SCHEMA, 'utf-8');
    expect(schema).toContain('cancelledAt');
    expect(schema).toMatch(/cancelledAt\s+DateTime\?/);
  });

  // --- Controller existence ---
  it('order.controller.ts exists', () => {
    expect(existsSync(ORDER_CONTROLLER)).toBe(true);
  });

  it('cancelOrder is exported from order.controller.ts', async () => {
    if (!existsSync(ORDER_CONTROLLER)) throw new Error('order.controller.ts missing');
    const mod = await import(ORDER_CONTROLLER);
    expect(typeof mod.cancelOrder).toBe('function');
  });

  // --- Atomicity checks (source analysis) ---
  it('cancelOrder uses prisma.$transaction for atomicity', () => {
    if (!existsSync(ORDER_CONTROLLER)) throw new Error('order.controller.ts missing');
    const content = readFileSync(ORDER_CONTROLLER, 'utf-8');
    expect(content).toContain('$transaction');
  });

  it('cancelOrder sets cancelledAt timestamp on the order', () => {
    if (!existsSync(ORDER_CONTROLLER)) throw new Error('order.controller.ts missing');
    const content = readFileSync(ORDER_CONTROLLER, 'utf-8');
    expect(content).toContain('cancelledAt');
    expect(content).toMatch(/cancelledAt\s*:\s*new Date/);
  });

  it('cancelOrder restores stock via increment on each OrderItem', () => {
    if (!existsSync(ORDER_CONTROLLER)) throw new Error('order.controller.ts missing');
    const content = readFileSync(ORDER_CONTROLLER, 'utf-8');
    expect(content).toMatch(/increment/);
    expect(content).toMatch(/stock/i);
  });

  it('cancelOrder only allows cancellation from PENDING or PROCESSING status', () => {
    if (!existsSync(ORDER_CONTROLLER)) throw new Error('order.controller.ts missing');
    const content = readFileSync(ORDER_CONTROLLER, 'utf-8');
    expect(content).toMatch(/PENDING|PROCESSING/);
  });

  // --- Concurrency guard at checkout ---
  it('POST /api/orders checkout path uses updateMany with stock guard (gte: quantity)', () => {
    const ordersRoute = readFileSync(
      path.resolve(ROOT, 'server/src/routes/orders.ts'),
      'utf-8'
    );
    expect(ordersRoute).toMatch(/updateMany|gte.*stock|stock.*gte/s);
  });
});
