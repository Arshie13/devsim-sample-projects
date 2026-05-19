import { describe, it, expect } from 'vitest';

// Candidate creates: src/lib/payroll.ts
const load = () => import('../../../src/lib/payroll');

describe('L4T1: splitHours', () => {
  it('is exported as a function', async () => {
    const { splitHours } = await load();
    expect(typeof splitHours).toBe('function');
  });

  it('treats all hours as regular below the 40-hour threshold', async () => {
    const { splitHours } = await load();
    expect(splitHours(35)).toEqual({ regular: 35, overtime: 0 });
  });

  it('splits hours above the threshold into overtime', async () => {
    const { splitHours } = await load();
    expect(splitHours(48)).toEqual({ regular: 40, overtime: 8 });
  });

  it('handles exactly the threshold', async () => {
    const { splitHours } = await load();
    expect(splitHours(40)).toEqual({ regular: 40, overtime: 0 });
  });

  it('accepts a custom threshold', async () => {
    const { splitHours } = await load();
    expect(splitHours(45, 35)).toEqual({ regular: 35, overtime: 10 });
  });
});
