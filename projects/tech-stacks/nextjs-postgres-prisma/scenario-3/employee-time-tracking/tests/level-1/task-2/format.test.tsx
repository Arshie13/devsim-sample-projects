import { describe, it, expect } from 'vitest';

// Candidate creates: src/lib/format.ts
const load = () => import('../../../src/lib/format');

describe('L1T2: formatHours', () => {
  it('is exported as a function', async () => {
    const { formatHours } = await load();
    expect(typeof formatHours).toBe('function');
  });

  it('always shows one decimal place and an "h" suffix', async () => {
    const { formatHours } = await load();
    expect(formatHours(8)).toBe('8.0h');
    expect(formatHours(8.5)).toBe('8.5h');
  });

  it('rounds to one decimal place', async () => {
    const { formatHours } = await load();
    expect(formatHours(8.46)).toBe('8.5h');
  });
});

describe('L1T2: formatCurrency', () => {
  it('is exported as a function', async () => {
    const { formatCurrency } = await load();
    expect(typeof formatCurrency).toBe('function');
  });

  it('formats with a dollar sign, two decimals and comma separators', async () => {
    const { formatCurrency } = await load();
    expect(formatCurrency(1234)).toBe('$1,234.00');
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('handles large amounts', async () => {
    const { formatCurrency } = await load();
    expect(formatCurrency(2750000)).toBe('$2,750,000.00');
  });
});
