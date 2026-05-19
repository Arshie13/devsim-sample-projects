import { describe, it, expect } from 'vitest';

// Candidate adds sumHours to: src/lib/time.ts
const load = () => import('../../../src/lib/time');

describe('L2T2: sumHours', () => {
  it('is exported as a function', async () => {
    const { sumHours } = await load();
    expect(typeof sumHours).toBe('function');
  });

  it('sums the duration of completed entries', async () => {
    const { sumHours } = await load();
    const entries = [
      { clock_in: '2026-05-20T09:00:00Z', clock_out: '2026-05-20T17:00:00Z' }, // 8h
      { clock_in: '2026-05-20T08:00:00Z', clock_out: '2026-05-20T12:30:00Z' }, // 4.5h
    ];
    expect(sumHours(entries)).toBe(12.5);
  });

  it('ignores entries that have not been clocked out', async () => {
    const { sumHours } = await load();
    const entries = [
      { clock_in: '2026-05-20T09:00:00Z', clock_out: '2026-05-20T17:00:00Z' }, // 8h
      { clock_in: '2026-05-20T09:00:00Z', clock_out: null },                   // ignored
    ];
    expect(sumHours(entries)).toBe(8);
  });

  it('returns zero for no entries', async () => {
    const { sumHours } = await load();
    expect(sumHours([])).toBe(0);
  });
});
