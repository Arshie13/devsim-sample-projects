import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { createApp } from "../../../../server/src/app.js";
import { Workout } from "../../../../server/src/models/Workout.js";
import { createTestUser } from "../../testUtils.js";

const app = createApp();

async function seedWorkouts(authorId: any, n: number) {
  for (let i = 0; i < n; i++) {
    await Workout.create({
      title: `W${i}`,
      slug: `w-${i}-${Math.random().toString(36).slice(2, 6)}`,
      authorId,
      category: "strength",
      exercises: [],
      notes: "",
      tags: [],
      performedAt: new Date(Date.now() - 86400000),
      durationMin: 30,
      cheerCount: i + 1,
    });
  }
}

describe("Level 3 — Task 2: leaderboard endpoint contract", () => {
  it("returns 200 and { success: true, data: [...] }", async () => {
    const { user } = await createTestUser();
    await seedWorkouts(user._id, 3);

    const res = await request(app).get("/api/workouts/leaderboard");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("respects ?limit and returns at most that many entries", async () => {
    for (let i = 0; i < 6; i++) {
      const { user } = await createTestUser({ username: `u_${i}_${Math.random().toString(36).slice(2)}` });
      await seedWorkouts(user._id, 1);
    }
    const res = await request(app).get("/api/workouts/leaderboard?limit=3");
    expect(res.status).toBe(200);
    expect((res.body.data as any[]).length).toBeLessThanOrEqual(3);
  });

  it("rejects ?limit=999 with 400", async () => {
    const res = await request(app).get("/api/workouts/leaderboard?limit=999");
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("rejects ?limit=0 with 400", async () => {
    const res = await request(app).get("/api/workouts/leaderboard?limit=0");
    expect(res.status).toBe(400);
  });

  it("rejects ?limit=abc with 400", async () => {
    const res = await request(app).get("/api/workouts/leaderboard?limit=abc");
    expect(res.status).toBe(400);
  });

  it("returns 200 with empty data array when no workouts exist", async () => {
    const res = await request(app).get("/api/workouts/leaderboard");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
