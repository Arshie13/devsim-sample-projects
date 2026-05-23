// @vitest-environment node

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Candidate creates: src/app/actions/leaderboard.ts
//
// Must export an async server action:
//   getActiveMembersRanking(): Promise<{
//     user_id: string; name: string; attendedCount: number;
//   }[]>
//
// Queries Prisma for all users including their attendances:
//   prisma.user.findMany({ include: { attendances: true } })
// Then projects { user_id, name: `${first_name} ${last_name}`, attendedCount }.
// Sort by attendedCount descending, breaking ties by name ascending.
// Includes members with zero attendance.

const findMany = vi.fn();

vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findMany,
    },
  },
}));

const load = () => import('../../../src/app/actions/leaderboard');

describe('L5T2: getActiveMembersRanking (server action)', () => {
  beforeEach(() => {
    findMany.mockReset();
  });

  it('is exported as an async function', async () => {
    const mod = await load();
    expect(typeof mod.getActiveMembersRanking).toBe('function');
  });

  it('queries Prisma including the user attendances', async () => {
    findMany.mockResolvedValue([]);
    const { getActiveMembersRanking } = await load();
    await getActiveMembersRanking();
    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        include: expect.objectContaining({ attendances: expect.anything() }),
      }),
    );
  });

  it('ranks members by attendance count descending', async () => {
    findMany.mockResolvedValue([
      { user_id: 'u1', first_name: 'Jordan', last_name: 'Rivera', attendances: [{}, {}, {}] },
      { user_id: 'u2', first_name: 'Alex', last_name: 'Cruz', attendances: [] },
      { user_id: 'u3', first_name: 'Sam', last_name: 'Diaz', attendances: [{}, {}] },
    ]);
    const { getActiveMembersRanking } = await load();
    const ranked = await getActiveMembersRanking();
    expect(ranked[0]).toEqual({ user_id: 'u1', name: 'Jordan Rivera', attendedCount: 3 });
    expect(ranked[1]).toEqual({ user_id: 'u3', name: 'Sam Diaz', attendedCount: 2 });
  });

  it('includes members with zero attendance', async () => {
    findMany.mockResolvedValue([
      { user_id: 'u1', first_name: 'Jordan', last_name: 'Rivera', attendances: [{}] },
      { user_id: 'u2', first_name: 'Alex', last_name: 'Cruz', attendances: [] },
    ]);
    const { getActiveMembersRanking } = await load();
    const ranked = await getActiveMembersRanking();
    const u2 = ranked.find((m) => m.user_id === 'u2');
    expect(u2?.attendedCount).toBe(0);
  });

  it('breaks ties by name ascending', async () => {
    findMany.mockResolvedValue([
      { user_id: 'u1', first_name: 'Sam', last_name: 'Diaz', attendances: [] },
      { user_id: 'u2', first_name: 'Alex', last_name: 'Cruz', attendances: [] },
    ]);
    const { getActiveMembersRanking } = await load();
    const ranked = await getActiveMembersRanking();
    expect(ranked.map((m) => m.name)).toEqual(['Alex Cruz', 'Sam Diaz']);
  });
});
