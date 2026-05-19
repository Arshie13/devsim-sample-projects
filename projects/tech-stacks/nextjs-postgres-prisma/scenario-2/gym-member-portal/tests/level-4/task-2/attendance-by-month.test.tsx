import { describe, it, expect } from 'vitest';

// Candidate adds groupAttendanceByMonth to: src/lib/stats.ts
const load = () => import('../../../src/lib/stats');

const attendances = [
  { attended_at: '2026-01-12T07:00:00Z' },
  { attended_at: '2026-03-04T18:00:00Z' },
  { attended_at: '2026-01-28T07:00:00Z' },
  { attended_at: '2026-03-19T17:30:00Z' },
  { attended_at: '2026-03-30T08:00:00Z' },
];

describe('L4T2: groupAttendanceByMonth', () => {
  it('is exported as a function', async () => {
    const { groupAttendanceByMonth } = await load();
    expect(typeof groupAttendanceByMonth).toBe('function');
  });

  it('groups attendance counts by YYYY-MM', async () => {
    const { groupAttendanceByMonth } = await load();
    expect(groupAttendanceByMonth(attendances)).toEqual([
      { month: '2026-01', count: 2 },
      { month: '2026-03', count: 3 },
    ]);
  });

  it('sorts months ascending', async () => {
    const { groupAttendanceByMonth } = await load();
    const result = groupAttendanceByMonth(attendances);
    expect(result.map((r) => r.month)).toEqual(['2026-01', '2026-03']);
  });

  it('returns an empty array for no attendance', async () => {
    const { groupAttendanceByMonth } = await load();
    expect(groupAttendanceByMonth([])).toEqual([]);
  });
});
