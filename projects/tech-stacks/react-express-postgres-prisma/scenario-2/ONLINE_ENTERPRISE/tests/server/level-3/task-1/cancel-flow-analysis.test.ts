import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import path from 'path';

const ROOT = path.resolve(__dirname, '../../../..');
const ORDERS_ROUTE = path.resolve(ROOT, 'server/src/routes/orders.ts');
const ORDER_CONTROLLER = path.resolve(ROOT, 'server/src/controllers/order.controller.ts');

describe('L3T1: Diagnose Cancelled-Order Stock Leak', () => {
  it('order.controller.ts file exists (cancelOrder logic must be extracted here)', () => {
    expect(existsSync(ORDER_CONTROLLER)).toBe(true);
  });

  it('cancelOrder function is exported from order.controller.ts', async () => {
    if (!existsSync(ORDER_CONTROLLER)) {
      throw new Error('order.controller.ts does not exist — create it first');
    }
    const mod = await import(ORDER_CONTROLLER);
    expect(mod.cancelOrder).toBeDefined();
    expect(typeof mod.cancelOrder).toBe('function');
  });

  it('PATCH /orders/:id/status handler in orders.ts does NOT silently skip stock restore', () => {
    const content = readFileSync(ORDERS_ROUTE, 'utf-8');
    // The PATCH /status endpoint must reference cancelOrder OR contain stock increment logic
    // A plain status-only update without stock restoration is the bug being diagnosed
    const hasCancelOrder = content.includes('cancelOrder');
    const hasStockRestore = /increment|restore.*stock|stock.*restore/i.test(content);
    expect(hasCancelOrder || hasStockRestore).toBe(true);
  });

  it('order.controller.ts references cancelledAt (tracks cancellation timestamp)', () => {
    if (!existsSync(ORDER_CONTROLLER)) {
      throw new Error('order.controller.ts does not exist');
    }
    const content = readFileSync(ORDER_CONTROLLER, 'utf-8');
    expect(content).toContain('cancelledAt');
  });

  it('schema.prisma Order model includes cancelledAt field', () => {
    const schema = readFileSync(
      path.resolve(ROOT, 'server/prisma/schema.prisma'),
      'utf-8'
    );
    expect(schema).toContain('cancelledAt');
  });
});
