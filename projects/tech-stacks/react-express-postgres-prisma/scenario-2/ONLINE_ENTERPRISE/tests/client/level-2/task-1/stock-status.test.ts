import { describe, it, expect } from 'vitest';

// Dynamic import so the test fails gracefully when the function is missing
// rather than crashing the whole suite.
async function loadGetStockStatus() {
  const mod = await import('../../../../client/src/utils/formatters');
  return (mod as any).getStockStatus as ((stock: number) => string) | undefined;
}

describe('L2T1: getStockStatus helper', () => {
  it('getStockStatus is exported from client/src/utils/formatters.ts', async () => {
    const fn = await loadGetStockStatus();
    expect(fn).toBeDefined();
    expect(typeof fn).toBe('function');
  });

  it('returns "OUT_OF_STOCK" when stock === 0', async () => {
    const getStockStatus = await loadGetStockStatus();
    expect(getStockStatus!(0)).toBe('OUT_OF_STOCK');
  });

  it('returns "OUT_OF_STOCK" when stock < 0', async () => {
    const getStockStatus = await loadGetStockStatus();
    expect(getStockStatus!(-1)).toBe('OUT_OF_STOCK');
    expect(getStockStatus!(-100)).toBe('OUT_OF_STOCK');
  });

  it('returns "LOW_STOCK" when stock === 1 (lower boundary)', async () => {
    const getStockStatus = await loadGetStockStatus();
    expect(getStockStatus!(1)).toBe('LOW_STOCK');
  });

  it('returns "LOW_STOCK" when stock === 5 (upper boundary)', async () => {
    const getStockStatus = await loadGetStockStatus();
    expect(getStockStatus!(5)).toBe('LOW_STOCK');
  });

  it('returns "LOW_STOCK" for values between 1 and 5', async () => {
    const getStockStatus = await loadGetStockStatus();
    expect(getStockStatus!(2)).toBe('LOW_STOCK');
    expect(getStockStatus!(3)).toBe('LOW_STOCK');
    expect(getStockStatus!(4)).toBe('LOW_STOCK');
  });

  it('returns "IN_STOCK" when stock === 6 (just above LOW_STOCK threshold)', async () => {
    const getStockStatus = await loadGetStockStatus();
    expect(getStockStatus!(6)).toBe('IN_STOCK');
  });

  it('returns "IN_STOCK" for large stock values', async () => {
    const getStockStatus = await loadGetStockStatus();
    expect(getStockStatus!(50)).toBe('IN_STOCK');
    expect(getStockStatus!(1000)).toBe('IN_STOCK');
  });

  it('is a pure function — repeated calls with same input return same output', async () => {
    const getStockStatus = await loadGetStockStatus();
    expect(getStockStatus!(0)).toBe(getStockStatus!(0));
    expect(getStockStatus!(3)).toBe(getStockStatus!(3));
    expect(getStockStatus!(10)).toBe(getStockStatus!(10));
  });
});
