import { describe, it, expect } from 'vitest';

// Candidate creates: src/lib/format.ts
const load = () => import('../../../src/lib/format');

describe('L1T2: formatPeso', () => {
  it('is exported as a function', async () => {
    const { formatPeso } = await load();
    expect(typeof formatPeso).toBe('function');
  });

  it('formats whole numbers with two decimals and the peso sign', async () => {
    const { formatPeso } = await load();
    expect(formatPeso(0)).toBe('₱0.00');
    expect(formatPeso(5)).toBe('₱5.00');
  });

  it('adds comma thousands separators', async () => {
    const { formatPeso } = await load();
    expect(formatPeso(1234.5)).toBe('₱1,234.50');
    expect(formatPeso(1000000)).toBe('₱1,000,000.00');
  });

  it('rounds to two decimal places', async () => {
    const { formatPeso } = await load();
    expect(formatPeso(9.999)).toBe('₱10.00');
    expect(formatPeso(3.1)).toBe('₱3.10');
  });

  it('handles negative amounts with the sign before the peso symbol', async () => {
    const { formatPeso } = await load();
    expect(formatPeso(-5)).toBe('-₱5.00');
  });
});
