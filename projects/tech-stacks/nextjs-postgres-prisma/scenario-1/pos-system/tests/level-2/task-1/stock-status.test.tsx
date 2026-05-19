import { describe, it, expect } from 'vitest';

// Candidate creates: src/lib/inventory.ts
const load = () => import('../../../src/lib/inventory');

describe('L2T1: getStockStatus', () => {
  it('is exported as a function', async () => {
    const { getStockStatus } = await load();
    expect(typeof getStockStatus).toBe('function');
  });

  it('returns OUT_OF_STOCK for zero or negative quantity', async () => {
    const { getStockStatus } = await load();
    expect(getStockStatus(0)).toBe('OUT_OF_STOCK');
    expect(getStockStatus(-3)).toBe('OUT_OF_STOCK');
  });

  it('returns LOW_STOCK for 1 through 5 (inclusive)', async () => {
    const { getStockStatus } = await load();
    expect(getStockStatus(1)).toBe('LOW_STOCK');
    expect(getStockStatus(5)).toBe('LOW_STOCK');
  });

  it('returns IN_STOCK above 5', async () => {
    const { getStockStatus } = await load();
    expect(getStockStatus(6)).toBe('IN_STOCK');
    expect(getStockStatus(500)).toBe('IN_STOCK');
  });

  it('is a pure function — same input, same output', async () => {
    const { getStockStatus } = await load();
    expect(getStockStatus(4)).toBe(getStockStatus(4));
  });
});
