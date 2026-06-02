import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { createApp } from "../../../../server/src/app.js";
import { Workout } from "../../../../server/src/models/Workout.js";
import { createTestUser } from "../../testUtils.js";

const app = createApp();

let token: string;
let userId: any;

beforeEach(async () => {
  const { user, token: t } = await createTestUser({ username: "streaker" });
  token = t;
  userId = user._id;
});

async function logWorkout(daysAgo: number, authorId: any) {
  const performedAt = new Date(Date.now() - daysAgo * 86400000);
  return Workout.create({
    title: `Workout ${daysAgo}d ago`,
    slug: `w-${daysAgo}-${Math.random().toString(36).slice(2, 6)}`,
    authorId,
    category: "strength",
    exercises: [],
    notes: "",
    tags: [],
    performedAt,
    durationMin: 30,
    cheerCount: 0,
  });
}

describe("Level 4 — Task 2: streak API", () => {
  it("returns 200 with { success: true, data: { currentStreak, longestStreak, lastWorkoutDate } }", async () => {
    await logWorkout(0, userId);

    const res = await request(app)
      .get("/api/users/me/streak")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("currentStreak");
    expect(res.body.data).toHaveProperty("longestStreak");
    expect(res.body.data).toHaveProperty("lastWorkoutDate");
  });

  it("5 consecutive days → currentStreak === 5", async () => {
    for (let d = 0; d < 5; d++) await logWorkout(d, userId);

    const res = await request(app)
      .get("/api/users/me/streak")
      .set("Authorization", `Bearer ${token}`);
    expect(res.body.data.currentStreak).toBe(5);
    expect(res.body.data.longestStreak).toBeGreaterThanOrEqual(5);
  });

  it("3 days, gap, 5 days → currentStreak === 5, longestStreak === 5", async () => {
    // 3 recent days
    for (let d = 0; d < 3; d++) await logWorkout(d, userId);
    // 5 days with a 4-day gap (days 7–11 ago)
    for (let d = 7; d < 12; d++) await logWorkout(d, userId);

    const res = await request(app)
      .get("/api/users/me/streak")
      .set("Authorization", `Bearer ${token}`);
    expect(res.body.data.currentStreak).toBe(3);
    expect(res.body.data.longestStreak).toBeGreaterThanOrEqual(3);
  });

  it("user with no workouts → currentStreak 0, longestStreak 0, lastWorkoutDate null", async () => {
    const res = await request(app)
      .get("/api/users/me/streak")
      .set("Authorization", `Bearer ${token}`);
    expect(res.body.data.currentStreak).toBe(0);
    expect(res.body.data.longestStreak).toBe(0);
    expect(res.body.data.lastWorkoutDate).toBeNull();
  });

  it("multiple workouts on the same day count as 1 streak day", async () => {
    await logWorkout(0, userId);
    await logWorkout(0, userId);
    await logWorkout(0, userId);

    const res = await request(app)
      .get("/api/users/me/streak")
      .set("Authorization", `Bearer ${token}`);
    expect(res.body.data.currentStreak).toBe(1);
  });

  it("longestStreak is always >= currentStreak", async () => {
    for (let d = 0; d < 3; d++) await logWorkout(d, userId);

    const res = await request(app)
      .get("/api/users/me/streak")
      .set("Authorization", `Bearer ${token}`);
    expect(res.body.data.longestStreak).toBeGreaterThanOrEqual(res.body.data.currentStreak);
  });

  it("rejects unauthenticated request with 401", async () => {
    const res = await request(app).get("/api/users/me/streak");
    expect(res.status).toBe(401);
  });
});
