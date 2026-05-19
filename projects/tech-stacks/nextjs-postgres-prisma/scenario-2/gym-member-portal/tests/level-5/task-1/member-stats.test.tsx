import { describe, it, expect } from 'vitest';

// Candidate adds computeMemberStats to: src/lib/stats.ts
const load = () => import('../../../src/lib/stats');

const classes = [
  { id: 1, name: 'Morning Yoga' },
  { id: 2, name: 'HIIT Bootcamp' },
  { id: 3, name: 'Spin Class' },
];

describe('L5T1: computeMemberStats', () => {
  it('is exported as a function', async () => {
    const { computeMemberStats } = await load();
    expect(typeof computeMemberStats).toBe('function');
  });

  it('counts bookings and attendances', async () => {
    const { computeMemberStats } = await load();
    const stats = computeMemberStats(
      [{ class_id: 1 }, { class_id: 2 }, { class_id: 3 }, { class_id: 1 }],
      [{ class_id: 1 }, { class_id: 1 }, { class_id: 3 }],
      classes,
    );
    expect(stats.totalBooked).toBe(4);
    expect(stats.totalAttended).toBe(3);
  });

  it('computes the attendance rate as a rounded percentage', async () => {
    const { computeMemberStats } = await load();
    const stats = computeMemberStats(
      [{ class_id: 1 }, { class_id: 2 }, { class_id: 3 }],
      [{ class_id: 1 }, { class_id: 3 }],
      classes,
    );
    expect(stats.attendanceRate).toBe(67);
  });

  it('names the most-attended class as the favourite', async () => {
    const { computeMemberStats } = await load();
    const stats = computeMemberStats(
      [{ class_id: 1 }],
      [{ class_id: 1 }, { class_id: 1 }, { class_id: 3 }],
      classes,
    );
    expect(stats.favoriteClassName).toBe('Morning Yoga');
  });

  it('is safe when the member has no bookings or attendance', async () => {
    const { computeMemberStats } = await load();
    const stats = computeMemberStats([], [], classes);
    expect(stats.attendanceRate).toBe(0);
    expect(stats.favoriteClassName).toBeNull();
  });
});
