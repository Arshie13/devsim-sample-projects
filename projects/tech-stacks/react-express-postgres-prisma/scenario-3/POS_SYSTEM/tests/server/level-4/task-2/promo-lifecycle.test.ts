import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import path from 'path';

const ROOT = path.resolve(__dirname, '../../../..');
const PROMO_CONTROLLER = path.resolve(ROOT, 'server/src/controllers/promo.controller.ts');
const PROMO_ROUTE = path.resolve(ROOT, 'server/src/routes/promos.ts');
const ORDERS_ROUTE = path.resolve(ROOT, 'server/src/routes/orders.ts');
const ORDER_CONTROLLER = path.resolve(ROOT, 'server/src/controllers/order.controller.ts');

describe('L4T2: Promo Lifecycle + Usage Integrity', () => {
  it('order creation enforces usedCount < maxUses atomically', () => {
    const content = readFileSync(ORDERS_ROUTE, 'utf-8');
    // Expect an updateMany or equivalent with a maxUses/usedCount guard
    expect(content).toMatch(/usedCount/);
    expect(content).toMatch(/maxUses|lt\s*:/);
  });

  it('order creation validates expiresAt > now', () => {
    const content = readFileSync(ORDERS_ROUTE, 'utf-8');
    expect(content).toMatch(/expiresAt/);
  });

  it('promos.ts exposes GET / admin route', () => {
    const content = readFileSync(PROMO_ROUTE, 'utf-8');
    expect(content).toMatch(/get\s*\(\s*['"]\/['"]/);
    expect(content).toMatch(/authorize\s*\(\s*['"]ADMIN['"]/);
  });

  it('listPromosHandler exposes remainingUses', () => {
    expect(existsSync(PROMO_CONTROLLER)).toBe(true);
    const content = readFileSync(PROMO_CONTROLLER, 'utf-8');
    expect(content).toMatch(/listPromosHandler/);
    expect(content).toMatch(/remainingUses/);
  });

  it('voidOrder decrements PromoCode usedCount when order had promo', () => {
    const content = readFileSync(ORDER_CONTROLLER, 'utf-8');
    expect(content).toMatch(/promoCodeId|promoCode/);
    expect(content).toMatch(/decrement/);
  });

  const SETTINGS_PAGE = path.resolve(ROOT, 'client/src/pages/settings/SettingsPage.tsx');

  it('SettingsPage renders admin promo panel', () => {
    const content = readFileSync(SETTINGS_PAGE, 'utf-8');
    expect(content).toMatch(/promoService|listPromos/);
    expect(content).toMatch(/[Pp]romo\s*[Cc]ode/);
  });

  it('SettingsPage shows remainingUses for each promo', () => {
    const content = readFileSync(SETTINGS_PAGE, 'utf-8');
    expect(content).toMatch(/remainingUses/);
  });
});
