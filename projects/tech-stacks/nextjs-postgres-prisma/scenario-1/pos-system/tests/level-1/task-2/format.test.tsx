import { describe, it, expect } from 'vitest';

// Candidate creates: src/lib/format.ts
//
// Export a pure helper:
//   formatPeso(amount: number): string
//
// Prefix the peso sign (₱) and always show exactly two decimal places,
// rounding to the nearest centavo. This is the first coding task — a single
// stdlib method (Number.prototype.toFixed) covers every case below.
const load = () => import('../../../src/lib/format');

describe('L1T2: formatPeso', () => {
  it('is exported as a function', async () => {
    const { formatPeso } = await load();
    expect(typeof formatPeso).toBe('function');
  });

  it('prefixes the peso sign and shows two decimals', async () => {
    const { formatPeso } = await load();
    expect(formatPeso(0)).toBe('₱0.00');
    expect(formatPeso(5)).toBe('₱5.00');
    expect(formatPeso(120)).toBe('₱120.00');
  });

  it('keeps two decimals for fractional amounts', async () => {
    const { formatPeso } = await load();
    expect(formatPeso(3.1)).toBe('₱3.10');
    expect(formatPeso(95.5)).toBe('₱95.50');
  });

  it('rounds to two decimal places', async () => {
    const { formatPeso } = await load();
    expect(formatPeso(9.999)).toBe('₱10.00');
    expect(formatPeso(2.345)).toBe('₱2.35');
  });
});
