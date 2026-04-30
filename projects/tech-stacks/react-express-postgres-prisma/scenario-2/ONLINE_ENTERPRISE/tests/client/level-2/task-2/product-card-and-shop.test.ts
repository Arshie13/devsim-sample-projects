import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import path from 'path';

const ROOT = path.resolve(__dirname, '../../../..');
const PRODUCT_CARD = path.resolve(ROOT, 'client/src/components/ProductCard.tsx');
const SHOP_PAGE = path.resolve(ROOT, 'client/src/pages/Shop.tsx');

describe('L2T2: Stock Helper Adoption in ProductCard & Shop', () => {
  // --- ProductCard ---
  it('ProductCard.tsx imports getStockStatus', () => {
    const content = readFileSync(PRODUCT_CARD, 'utf-8');
    expect(content).toMatch(/import.*getStockStatus/);
  });

  it('ProductCard.tsx uses getStockStatus() to determine badge display', () => {
    const content = readFileSync(PRODUCT_CARD, 'utf-8');
    expect(content).toContain('getStockStatus');
  });

  it('ProductCard.tsx does NOT use raw inline stock comparisons (stock === 0 or stock <= 5)', () => {
    const content = readFileSync(PRODUCT_CARD, 'utf-8');
    // Should be refactored to use the helper
    expect(content).not.toMatch(/product\.stock\s*===\s*0/);
    expect(content).not.toMatch(/product\.stock\s*<=\s*5/);
  });

  // --- Shop Page ---
  it('Shop.tsx imports getStockStatus', () => {
    const content = readFileSync(SHOP_PAGE, 'utf-8');
    expect(content).toMatch(/import.*getStockStatus/);
  });

  it('Shop.tsx has a "Hide out-of-stock" toggle state', () => {
    const content = readFileSync(SHOP_PAGE, 'utf-8');
    // Should have a boolean state for the toggle
    expect(content).toMatch(/[Hh]ide[Oo]ut[Oo]f[Ss]tock|hideOutOfStock|showOutOfStock|hideOutofStock/);
  });

  it('Shop.tsx uses getStockStatus for filtering out-of-stock products', () => {
    const content = readFileSync(SHOP_PAGE, 'utf-8');
    expect(content).toContain('getStockStatus');
    expect(content).toContain('OUT_OF_STOCK');
  });

  it('Shop.tsx renders a toggle button/checkbox for hiding out-of-stock items', () => {
    const content = readFileSync(SHOP_PAGE, 'utf-8');
    // Should contain UI element text
    expect(content).toMatch(/[Hh]ide.*[Oo]ut.of.stock|[Oo]ut.of.stock.*[Hh]ide/);
  });
});
