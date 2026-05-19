import { describe, it, expect } from 'vitest';

// Candidate creates: src/lib/format.ts
const load = () => import('../../../src/lib/format');

describe('L1T2: formatMemberName', () => {
  it('is exported as a function', async () => {
    const { formatMemberName } = await load();
    expect(typeof formatMemberName).toBe('function');
  });

  it('joins first and last name with a single space', async () => {
    const { formatMemberName } = await load();
    expect(formatMemberName('Jordan', 'Rivera')).toBe('Jordan Rivera');
  });

  it('trims surrounding whitespace from each part', async () => {
    const { formatMemberName } = await load();
    expect(formatMemberName('  Jordan ', ' Rivera  ')).toBe('Jordan Rivera');
  });

  it('handles a missing part without leaving stray spaces', async () => {
    const { formatMemberName } = await load();
    expect(formatMemberName('Jordan', '')).toBe('Jordan');
    expect(formatMemberName('', 'Rivera')).toBe('Rivera');
  });
});

describe('L1T2: formatShortDate', () => {
  it('is exported as a function', async () => {
    const { formatShortDate } = await load();
    expect(typeof formatShortDate).toBe('function');
  });

  it('formats an ISO string as YYYY-MM-DD', async () => {
    const { formatShortDate } = await load();
    expect(formatShortDate('2025-03-08T00:00:00Z')).toBe('2025-03-08');
  });

  it('accepts a Date object', async () => {
    const { formatShortDate } = await load();
    expect(formatShortDate(new Date('2025-12-25T09:30:00Z'))).toBe('2025-12-25');
  });
});
