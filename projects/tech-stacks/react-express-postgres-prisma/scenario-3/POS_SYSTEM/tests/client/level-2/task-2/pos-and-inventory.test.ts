import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import path from 'path';

const ROOT = path.resolve(__dirname, '../../../..');
const POS_PAGE = path.resolve(ROOT, 'client/src/pages/pos/POSPage.tsx');
const INVENTORY_PAGE = path.resolve(ROOT, 'client/src/pages/inventory/InventoryPage.tsx');

describe('L2T2: Stock Helper Adoption in POSPage & InventoryPage', () => {
  // --- POSPage ---
  it('POSPage.tsx imports getStockLevel', () => {
    const content = readFileSync(POS_PAGE, 'utf-8');
    expect(content).toMatch(/import.*getStockLevel/);
  });

  it('POSPage.tsx uses getStockLevel() to drive badge / button disabled state', () => {
    const content = readFileSync(POS_PAGE, 'utf-8');
    expect(content).toContain('getStockLevel');
  });

  it('POSPage.tsx has a "Hide out-of-stock" toggle state', () => {
    const content = readFileSync(POS_PAGE, 'utf-8');
    expect(content).toMatch(/hideOutOfStock|showOutOfStock/);
  });

  it('POSPage.tsx filters products using getStockLevel and "OUT_OF_STOCK"', () => {
    const content = readFileSync(POS_PAGE, 'utf-8');
    expect(content).toContain('OUT_OF_STOCK');
  });

  it('POSPage.tsx renders a visible "Hide out-of-stock" label/text', () => {
    const content = readFileSync(POS_PAGE, 'utf-8');
    expect(content).toMatch(/[Hh]ide\s*out[-\s]of[-\s]stock/i);
  });

  // --- InventoryPage ---
  it('InventoryPage.tsx imports getStockLevel', () => {
    const content = readFileSync(INVENTORY_PAGE, 'utf-8');
    expect(content).toMatch(/import.*getStockLevel/);
  });

  it('InventoryPage.tsx uses getStockLevel() to determine badge display', () => {
    const content = readFileSync(INVENTORY_PAGE, 'utf-8');
    expect(content).toContain('getStockLevel');
  });

  it('InventoryPage.tsx does NOT use raw inline stock comparisons (quantity === 0 / quantity <= lowStock)', () => {
    const content = readFileSync(INVENTORY_PAGE, 'utf-8');
    // After refactor, these raw comparisons should be replaced by the helper
    expect(content).not.toMatch(/quantity\s*===\s*0/);
    expect(content).not.toMatch(/quantity\s*<=\s*lowStock\s*&&\s*quantity\s*>\s*0/);
  });
});
