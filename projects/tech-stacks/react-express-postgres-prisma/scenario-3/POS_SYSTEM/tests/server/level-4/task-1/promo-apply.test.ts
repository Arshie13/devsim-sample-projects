import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import path from 'path';

const ROOT = path.resolve(__dirname, '../../../..');
const SCHEMA = path.resolve(ROOT, 'server/prisma/schema.prisma');
const PROMO_CONTROLLER = path.resolve(ROOT, 'server/src/controllers/promo.controller.ts');
const PROMO_ROUTE = path.resolve(ROOT, 'server/src/routes/promos.ts');
const ORDERS_ROUTE = path.resolve(ROOT, 'server/src/routes/orders.ts');
const INDEX = path.resolve(ROOT, 'server/src/index.ts');

describe('L4T1: Validate & Apply Promo Code (server)', () => {
  // --- Schema ---
  it('schema.prisma has PromoCode model', () => {
    const schema = readFileSync(SCHEMA, 'utf-8');
    expect(schema).toMatch(/model\s+PromoCode/);
  });

  it('PromoCode has code field with @unique', () => {
    const schema = readFileSync(SCHEMA, 'utf-8');
    expect(schema).toMatch(/code\s+String\s+@unique/);
  });

  it('PromoCode has discountPercent, maxUses, usedCount, expiresAt, isActive fields', () => {
    const schema = readFileSync(SCHEMA, 'utf-8');
    expect(schema).toMatch(/discountPercent\s+Int/);
    expect(schema).toMatch(/maxUses\s+Int/);
    expect(schema).toMatch(/usedCount\s+Int\s+@default\(0\)/);
    expect(schema).toMatch(/expiresAt\s+DateTime/);
    expect(schema).toMatch(/isActive\s+Boolean\s+@default\(true\)/);
  });

  // --- Controller ---
  it('promo.controller.ts exists', () => {
    expect(existsSync(PROMO_CONTROLLER)).toBe(true);
  });

  it('validatePromo is exported from promo.controller.ts', async () => {
    const mod = await import(PROMO_CONTROLLER);
    expect(typeof mod.validatePromo).toBe('function');
  });

  it('validatePromoHandler is exported from promo.controller.ts', async () => {
    const mod = await import(PROMO_CONTROLLER);
    expect(typeof mod.validatePromoHandler).toBe('function');
  });

  it('validatePromo returns discriminated union with ok flag', () => {
    const content = readFileSync(PROMO_CONTROLLER, 'utf-8');
    expect(content).toMatch(/ok:\s*true/);
    expect(content).toMatch(/ok:\s*false/);
    expect(content).toMatch(/NOT_FOUND|INACTIVE|EXPIRED|EXHAUSTED/);
  });

  // --- Route ---
  it('promos.ts route file exists', () => {
    expect(existsSync(PROMO_ROUTE)).toBe(true);
  });

  it('POST /validate route is registered on promo router', () => {
    const content = readFileSync(PROMO_ROUTE, 'utf-8');
    expect(content).toMatch(/post\s*\(\s*['"]\/validate['"]/);
  });

  it('/api/promos is mounted in index.ts', () => {
    const content = readFileSync(INDEX, 'utf-8');
    expect(content).toMatch(/\/api\/promos/);
  });

  // --- Order integration ---
  it('POST /api/orders accepts optional promoCode', () => {
    const content = readFileSync(ORDERS_ROUTE, 'utf-8');
    expect(content).toMatch(/promoCode/);
  });

  it('order transaction increments PromoCode usedCount atomically', () => {
    const content = readFileSync(ORDERS_ROUTE, 'utf-8');
    expect(content).toMatch(/usedCount/);
    expect(content).toMatch(/increment/);
  });
});
