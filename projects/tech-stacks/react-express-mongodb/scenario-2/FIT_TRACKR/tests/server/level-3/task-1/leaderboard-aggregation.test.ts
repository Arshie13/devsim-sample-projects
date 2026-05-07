import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { createApp } from "../../../../server/src/app.js";
import { Workout } from "../../../../server/src/models/Workout.js";
import { createTestUser } from "../../testUtils.js";

const app = createApp();

async function seedWorkout(opts: {
  authorId: any;
  title: string;
  daysAgo: number;
  cheerCount: number;
  category?: string;
}) {
  const performedAt = new Date(Date.now() - opts.daysAgo * 86400000);
  return Workout.create({
    title: opts.title,
    slug: `${opts.title.toLowerCase().replace(/\s+/g, "-")}-${Math.random().toString(36).slice(2, 6)}`,
    authorId: opts.authorId,
    category: opts.category ?? "strength",
    exercises: [],
    notes: "",
    tags: [],
    performedAt,
    durationMin: 30,
    cheerCount: opts.cheerCount,
  });
}

describe("Level 3 — Task 1: leaderboard aggregation", () => {
  let authorId: any;
  let author2Id: any;

  beforeEach(async () => {
    const { user: u1 } = await createTestUser({ username: "authorA" });
    const { user: u2 } = await createTestUser({ username: "authorB" });
    authorId = u1._id;
    author2Id = u2._id;
  });

  it("excludes workouts older than 7 days", async () => {
    await seedWorkout({ authorId, title: "Old Workout", daysAgo: 10, cheerCount: 100 });
    await seedWorkout({ authorId, title: "Fresh Workout", daysAgo: 2, cheerCount: 5 });

    const res = await request(app).get("/api/workouts/leaderboard");
    const body: any[] = res.body?.data ?? res.body;

    const allRecentOnly = (body ?? []).every((entry: any) => entry.totalCheers !== 100);
    expect(allRecentOnly).toBe(true);
  });

  it("returns at most 10 entries", async () => {
    for (let i = 0; i < 12; i++) {
      const { user } = await createTestUser({ username: `user_${i}_${Math.random().toString(36).slice(2)}` });
      await seedWorkout({ authorId: user._id, title: `W${i}`, daysAgo: 1, cheerCount: i });
    }
    const res = await request(app).get("/api/workouts/leaderboard");
    const body: any[] = res.body?.data ?? res.body;
    expect((body ?? []).length).toBeLessThanOrEqual(10);
  });

  it("sorts by totalCheers descending", async () => {
    await seedWorkout({ authorId, title: "Low Cheer", daysAgo: 1, cheerCount: 2 });
    await seedWorkout({ authorId: author2Id, title: "High Cheer", daysAgo: 1, cheerCount: 20 });

    const res = await request(app).get("/api/workouts/leaderboard");
    const body: any[] = res.body?.data ?? res.body;
    if (!body || body.length < 2) return;

    const firstCheers = body[0].totalCheers ?? 0;
    const secondCheers = body[1].totalCheers ?? 0;
    expect(firstCheers).toBeGreaterThanOrEqual(secondCheers);
  });

  it("response items have userId, username, totalCheers, workoutCount fields", async () => {
    await seedWorkout({ authorId, title: "Test W", daysAgo: 1, cheerCount: 5 });

    const res = await request(app).get("/api/workouts/leaderboard");
    const body: any[] = res.body?.data ?? res.body;
    if (!body || body.length === 0) return;

    const entry = body[0];
    expect(entry).toHaveProperty("userId");
    expect(entry).toHaveProperty("username");
    expect(entry).toHaveProperty("totalCheers");
    expect(entry).toHaveProperty("workoutCount");
  });

  it("response does not include the raw workouts array", async () => {
    await seedWorkout({ authorId, title: "W1", daysAgo: 1, cheerCount: 3 });

    const res = await request(app).get("/api/workouts/leaderboard");
    const body: any[] = res.body?.data ?? res.body;
    for (const entry of body ?? []) {
      expect(entry.workouts).toBeUndefined();
    }
  });

  it("returns an empty array when no workouts exist in last 7 days", async () => {
    await seedWorkout({ authorId, title: "Old", daysAgo: 30, cheerCount: 99 });

    const res = await request(app).get("/api/workouts/leaderboard");
    const body: any[] = res.body?.data ?? res.body;
    expect((body ?? []).length).toBe(0);
  });
});
