import { describe, it, expect } from 'vitest';

// Candidate adds rankActiveMembers to: src/lib/stats.ts
const load = () => import('../../../src/lib/stats');

const members = [
  { user_id: 'u1', first_name: 'Jordan', last_name: 'Rivera' },
  { user_id: 'u2', first_name: 'Alex', last_name: 'Cruz' },
  { user_id: 'u3', first_name: 'Sam', last_name: 'Diaz' },
];

const attendances = [
  { user_id: 'u1' },
  { user_id: 'u3' },
  { user_id: 'u1' },
  { user_id: 'u3' },
  { user_id: 'u1' },
];

describe('L5T2: rankActiveMembers', () => {
  it('is exported as a function', async () => {
    const { rankActiveMembers } = await load();
    expect(typeof rankActiveMembers).toBe('function');
  });

  it('ranks members by attendance count descending', async () => {
    const { rankActiveMembers } = await load();
    const ranked = rankActiveMembers(members, attendances);
    expect(ranked[0]).toEqual({ user_id: 'u1', name: 'Jordan Rivera', attendedCount: 3 });
    expect(ranked[1]).toEqual({ user_id: 'u3', name: 'Sam Diaz', attendedCount: 2 });
  });

  it('includes members with zero attendance', async () => {
    const { rankActiveMembers } = await load();
    const ranked = rankActiveMembers(members, attendances);
    const u2 = ranked.find((m) => m.user_id === 'u2');
    expect(u2?.attendedCount).toBe(0);
  });

  it('breaks ties by name ascending', async () => {
    const { rankActiveMembers } = await load();
    // u2 (Alex) and u3-less... give u2 and a new equal-count member.
    const ranked = rankActiveMembers(members, [{ user_id: 'u1' }]);
    // u2 "Alex Cruz" and u3 "Sam Diaz" both have 0 — Alex sorts first.
    const zeros = ranked.filter((m) => m.attendedCount === 0).map((m) => m.name);
    expect(zeros).toEqual(['Alex Cruz', 'Sam Diaz']);
  });
});
