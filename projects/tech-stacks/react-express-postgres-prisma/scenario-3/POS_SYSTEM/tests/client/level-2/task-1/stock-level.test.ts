import { describe, it, expect } from 'vitest';

async function loadGetStockLevel() {
  const mod = await import('../../../../client/src/utils/formatters');
  return (mod as any).getStockLevel as
    | ((quantity: number, threshold: number) => string)
    | undefined;
}

describe('L2T1: getStockLevel helper', () => {
  it('getStockLevel is exported from client/src/utils/formatters.ts', async () => {
    const fn = await loadGetStockLevel();
    expect(fn).toBeDefined();
    expect(typeof fn).toBe('function');
  });

  it('returns "OUT_OF_STOCK" when quantity === 0', async () => {
    const getStockLevel = await loadGetStockLevel();
    expect(getStockLevel!(0, 10)).toBe('OUT_OF_STOCK');
  });

  it('returns "OUT_OF_STOCK" when quantity < 0', async () => {
    const getStockLevel = await loadGetStockLevel();
    expect(getStockLevel!(-1, 10)).toBe('OUT_OF_STOCK');
    expect(getStockLevel!(-100, 10)).toBe('OUT_OF_STOCK');
  });

  it('returns "LOW_STOCK" when quantity === 1 (just above zero, below threshold)', async () => {
    const getStockLevel = await loadGetStockLevel();
    expect(getStockLevel!(1, 10)).toBe('LOW_STOCK');
  });

  it('returns "LOW_STOCK" when quantity === threshold (upper boundary)', async () => {
    const getStockLevel = await loadGetStockLevel();
    expect(getStockLevel!(10, 10)).toBe('LOW_STOCK');
    expect(getStockLevel!(5, 5)).toBe('LOW_STOCK');
  });

  it('returns "IN_STOCK" when quantity > threshold', async () => {
    const getStockLevel = await loadGetStockLevel();
    expect(getStockLevel!(11, 10)).toBe('IN_STOCK');
    expect(getStockLevel!(100, 10)).toBe('IN_STOCK');
  });

  it('respects per-product threshold (different thresholds yield different classifications)', async () => {
    const getStockLevel = await loadGetStockLevel();
    // Same quantity but different thresholds
    expect(getStockLevel!(8, 10)).toBe('LOW_STOCK');
    expect(getStockLevel!(8, 5)).toBe('IN_STOCK');
  });

  it('is a pure function — repeated calls with same input return same output', async () => {
    const getStockLevel = await loadGetStockLevel();
    expect(getStockLevel!(0, 10)).toBe(getStockLevel!(0, 10));
    expect(getStockLevel!(3, 10)).toBe(getStockLevel!(3, 10));
    expect(getStockLevel!(50, 10)).toBe(getStockLevel!(50, 10));
  });
});
