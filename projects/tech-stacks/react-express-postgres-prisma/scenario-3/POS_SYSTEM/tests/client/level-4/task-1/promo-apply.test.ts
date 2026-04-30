import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import path from 'path';

const ROOT = path.resolve(__dirname, '../../../..');
const PROMO_SERVICE = path.resolve(ROOT, 'client/src/services/promoService.ts');
const POS_PAGE = path.resolve(ROOT, 'client/src/pages/pos/POSPage.tsx');

describe('L4T1: Validate & Apply Promo Code (client)', () => {
  it('promoService.ts exists', () => {
    expect(existsSync(PROMO_SERVICE)).toBe(true);
  });

  it('promoService exports validatePromo', () => {
    const content = readFileSync(PROMO_SERVICE, 'utf-8');
    expect(content).toMatch(/validatePromo/);
  });

  it('promoService posts to /promos/validate', () => {
    const content = readFileSync(PROMO_SERVICE, 'utf-8');
    expect(content).toMatch(/\/promos\/validate/);
  });

  it('POSPage imports promoService', () => {
    const content = readFileSync(POS_PAGE, 'utf-8');
    expect(content).toMatch(/promoService|validatePromo/);
    expect(content).toMatch(/from\s+['"][^'"]*promoService['"]/);
  });

  it('POSPage checkout modal contains a Promo Code input', () => {
    const content = readFileSync(POS_PAGE, 'utf-8');
    expect(content).toMatch(/[Pp]romo\s*[Cc]ode/);
    expect(content).toMatch(/Apply/);
  });

  it('POSPage renders applied discount state', () => {
    const content = readFileSync(POS_PAGE, 'utf-8');
    expect(content).toMatch(/discountPercent/);
  });
});
