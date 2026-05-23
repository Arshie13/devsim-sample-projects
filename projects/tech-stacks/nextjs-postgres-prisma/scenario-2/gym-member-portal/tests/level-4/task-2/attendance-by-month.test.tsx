// @vitest-environment node

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Candidate creates: src/app/actions/attendance.ts
//
// Must export an async server action:
//   getAttendanceByMonth(userId: string):
//     Promise<{ month: string; count: number }[]>
//
// Queries Prisma for the user's attendances (mocked) and groups by
// "YYYY-MM" (UTC). Returns months sorted ascending. Returns [] when
// the user has no attendance records.

const findMany = vi.fn();

vi.mock('@/lib/prisma', () => ({
  prisma: {
    attendance: {
      findMany,
    },
  },
}));

const load = () => import('../../../src/app/actions/attendance');

describe('L4T2: getAttendanceByMonth (server action)', () => {
  beforeEach(() => {
    findMany.mockReset();
  });

  it('is exported as an async function', async () => {
    const mod = await load();
    expect(typeof mod.getAttendanceByMonth).toBe('function');
  });

  it('queries Prisma by user_id', async () => {
    findMany.mockResolvedValue([]);
    const { getAttendanceByMonth } = await load();
    await getAttendanceByMonth('u1');
    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { user_id: 'u1' } }),
    );
  });

  it('groups attendance counts by YYYY-MM (UTC)', async () => {
    findMany.mockResolvedValue([
      { attended_at: new Date('2026-01-12T07:00:00Z') },
      { attended_at: new Date('2026-03-04T18:00:00Z') },
      { attended_at: new Date('2026-01-28T07:00:00Z') },
      { attended_at: new Date('2026-03-19T17:30:00Z') },
      { attended_at: new Date('2026-03-30T08:00:00Z') },
    ]);
    const { getAttendanceByMonth } = await load();
    expect(await getAttendanceByMonth('u1')).toEqual([
      { month: '2026-01', count: 2 },
      { month: '2026-03', count: 3 },
    ]);
  });

  it('sorts months ascending', async () => {
    findMany.mockResolvedValue([
      { attended_at: new Date('2026-04-01T00:00:00Z') },
      { attended_at: new Date('2026-02-01T00:00:00Z') },
      { attended_at: new Date('2026-03-01T00:00:00Z') },
    ]);
    const { getAttendanceByMonth } = await load();
    const result = await getAttendanceByMonth('u1');
    expect(result.map((r) => r.month)).toEqual(['2026-02', '2026-03', '2026-04']);
  });

  it('returns an empty array when there is no attendance', async () => {
    findMany.mockResolvedValue([]);
    const { getAttendanceByMonth } = await load();
    expect(await getAttendanceByMonth('u1')).toEqual([]);
  });
});
