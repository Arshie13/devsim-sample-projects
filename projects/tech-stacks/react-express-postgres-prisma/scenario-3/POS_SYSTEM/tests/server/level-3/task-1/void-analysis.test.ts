import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import path from 'path';

const ROOT = path.resolve(__dirname, '../../../..');
const ORDERS_ROUTE = path.resolve(ROOT, 'server/src/routes/orders.ts');
const ORDER_CONTROLLER = path.resolve(ROOT, 'server/src/controllers/order.controller.ts');
const SCHEMA = path.resolve(ROOT, 'server/prisma/schema.prisma');

describe('L3T1: Diagnose Oversell Race & Missing Void Flow', () => {
  it('order.controller.ts file exists (void flow must be introduced here)', () => {
    expect(existsSync(ORDER_CONTROLLER)).toBe(true);
  });

  it('voidOrder function is exported from order.controller.ts', async () => {
    if (!existsSync(ORDER_CONTROLLER)) {
      throw new Error('order.controller.ts does not exist — create it first');
    }
    const mod = await import(ORDER_CONTROLLER);
    expect(mod.voidOrder).toBeDefined();
    expect(typeof mod.voidOrder).toBe('function');
  });

  it('order.controller.ts references voidedAt (tracks void timestamp)', () => {
    if (!existsSync(ORDER_CONTROLLER)) {
      throw new Error('order.controller.ts does not exist');
    }
    const content = readFileSync(ORDER_CONTROLLER, 'utf-8');
    expect(content).toContain('voidedAt');
  });

  it('schema.prisma Order model includes voidedAt field', () => {
    const schema = readFileSync(SCHEMA, 'utf-8');
    expect(schema).toContain('voidedAt');
  });

  it('POST /:id/void route is registered in orders.ts', () => {
    const content = readFileSync(ORDERS_ROUTE, 'utf-8');
    expect(content).toMatch(/post\s*\(\s*['"]\/:id\/void['"]|\/:id\/void/);
  });
});
