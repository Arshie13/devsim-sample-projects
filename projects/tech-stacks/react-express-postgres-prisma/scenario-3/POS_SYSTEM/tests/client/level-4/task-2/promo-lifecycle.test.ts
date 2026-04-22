import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import path from 'path';

const ROOT = path.resolve(__dirname, '../../../..');
const SETTINGS_PAGE = path.resolve(ROOT, 'client/src/pages/settings/SettingsPage.tsx');
const PROMO_SERVICE = path.resolve(ROOT, 'client/src/services/promoService.ts');

describe('L4T2: Promo Admin Panel (client)', () => {
  it('promoService exports listPromos', () => {
    expect(existsSync(PROMO_SERVICE)).toBe(true);
    const content = readFileSync(PROMO_SERVICE, 'utf-8');
    expect(content).toMatch(/listPromos/);
    expect(content).toMatch(/\/promos/);
  });

  it('SettingsPage imports promoService', () => {
    const content = readFileSync(SETTINGS_PAGE, 'utf-8');
    expect(content).toMatch(/from\s+['"][^'"]*promoService['"]/);
  });

  it('SettingsPage shows code, discountPercent, remainingUses, expiresAt', () => {
    const content = readFileSync(SETTINGS_PAGE, 'utf-8');
    expect(content).toMatch(/code/);
    expect(content).toMatch(/discountPercent/);
    expect(content).toMatch(/remainingUses/);
    expect(content).toMatch(/expiresAt/);
  });
});
