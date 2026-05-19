import { describe, it, expect } from 'vitest';

// Candidate adds computeGrossPay to: src/lib/payroll.ts
const load = () => import('../../../src/lib/payroll');

describe('L4T2: computeGrossPay', () => {
  it('is exported as a function', async () => {
    const { computeGrossPay } = await load();
    expect(typeof computeGrossPay).toBe('function');
  });

  it('pays regular hours at the base rate', async () => {
    const { computeGrossPay } = await load();
    expect(computeGrossPay(40, 0, 25)).toBe(1000);
  });

  it('pays overtime hours at 1.5x the base rate', async () => {
    const { computeGrossPay } = await load();
    // 40 * 25 + 8 * 25 * 1.5 = 1000 + 300 = 1300
    expect(computeGrossPay(40, 8, 25)).toBe(1300);
  });

  it('rounds the result to two decimals', async () => {
    const { computeGrossPay } = await load();
    // 40 * 18.33 + 2 * 18.33 * 1.5 = 733.2 + 54.99 = 788.19
    expect(computeGrossPay(40, 2, 18.33)).toBe(788.19);
  });

  it('returns zero for no hours', async () => {
    const { computeGrossPay } = await load();
    expect(computeGrossPay(0, 0, 25)).toBe(0);
  });
});
