import { describe, it, expect } from 'vitest';

// Candidate creates: src/lib/format.ts
const load = () => import('../../../src/lib/format');

describe('L1T2: formatDate', () => {
  it('is exported as a function', async () => {
    const { formatDate } = await load();
    expect(typeof formatDate).toBe('function');
  });

  it('formats a Date object as YYYY-MM-DD', async () => {
    const { formatDate } = await load();
    expect(formatDate(new Date('2024-03-15'))).toBe('2024-03-15');
    expect(formatDate(new Date('2025-12-01'))).toBe('2025-12-01');
  });

  it('formats an ISO string as YYYY-MM-DD', async () => {
    const { formatDate } = await load();
    expect(formatDate('2024-03-15T10:30:00.000Z')).toBe('2024-03-15');
    expect(formatDate('2025-12-01T00:00:00.000Z')).toBe('2025-12-01');
  });

  it('pads single-digit months and days with zero', async () => {
    const { formatDate } = await load();
    expect(formatDate(new Date('2024-01-05'))).toBe('2024-01-05');
    expect(formatDate(new Date('2024-06-09'))).toBe('2024-06-09');
  });

  it('handles edge cases like leap years', async () => {
    const { formatDate } = await load();
    expect(formatDate(new Date('2024-02-29'))).toBe('2024-02-29');
  });
});
