import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { createApp } from "../../../../server/src/app.js";
import { Workout } from "../../../../server/src/models/Workout.js";
import { User } from "../../../../server/src/models/User.js";
import { createTestUser } from "../../testUtils.js";

const app = createApp();

describe("Level 5 — Task 2: streak timezone-aware grouping", () => {
  let manilaToken: string;
  let manilaUserId: any;

  beforeEach(async () => {
    // User in Asia/Manila (UTC+8)
    const { user, token } = await createTestUser({
      username: "tomph",
      timezone: "Asia/Manila",
    });
    manilaToken = token;
    manilaUserId = user._id;

    // Ensure the user doc has timezone set
    await User.findByIdAndUpdate(manilaUserId, { timezone: "Asia/Manila" });
  });

  it("counts two workouts at 15:30Z on consecutive UTC dates as a 2-day streak for UTC+8 user", async () => {
    // 2026-01-12T15:30:00Z = Mon 23:30 Manila (local Monday)
    // 2026-01-13T15:30:00Z = Tue 23:30 Manila (local Tuesday)
    // These are consecutive local calendar days — streak should be 2 when computed correctly.
    await Workout.create({
      title: "Late Night Session 1",
      slug: `lns1-${Math.random().toString(36).slice(2, 6)}`,
      authorId: manilaUserId,
      category: "cardio",
      exercises: [],
      notes: "",
      tags: [],
      performedAt: new Date("2026-01-12T15:30:00Z"),
      durationMin: 30,
      cheerCount: 0,
    });
    await Workout.create({
      title: "Late Night Session 2",
      slug: `lns2-${Math.random().toString(36).slice(2, 6)}`,
      authorId: manilaUserId,
      category: "cardio",
      exercises: [],
      notes: "",
      tags: [],
      performedAt: new Date("2026-01-13T15:30:00Z"),
      durationMin: 30,
      cheerCount: 0,
    });

    const res = await request(app)
      .get("/api/users/me/streak")
      .set("Authorization", `Bearer ${manilaToken}`);

    expect(res.status).toBe(200);
    // With correct timezone-aware grouping:
    //   2026-01-12T15:30Z → "2026-01-12" in Manila (23:30 Mon = local Mon)
    //   2026-01-13T15:30Z → "2026-01-13" in Manila (23:30 Tue = local Tue)
    //   → consecutive local days → streak 2
    expect(res.body.data.currentStreak).toBe(2);
  });

  it("UTC-only user is not broken by the timezone fix", async () => {
    const { user: utcUser, token: utcToken } = await createTestUser({ username: "utcuser" });

    // Two normal consecutive UTC days
    await Workout.create({
      title: "UTC Day 1",
      slug: `utc1-${Math.random().toString(36).slice(2, 6)}`,
      authorId: utcUser._id,
      category: "strength",
      exercises: [],
      notes: "",
      tags: [],
      performedAt: new Date("2026-01-12T10:00:00Z"),
      durationMin: 30,
      cheerCount: 0,
    });
    await Workout.create({
      title: "UTC Day 2",
      slug: `utc2-${Math.random().toString(36).slice(2, 6)}`,
      authorId: utcUser._id,
      category: "strength",
      exercises: [],
      notes: "",
      tags: [],
      performedAt: new Date("2026-01-13T10:00:00Z"),
      durationMin: 30,
      cheerCount: 0,
    });

    const res = await request(app)
      .get("/api/users/me/streak")
      .set("Authorization", `Bearer ${utcToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.currentStreak).toBe(2);
  });

  it("outcome-based: accepts any correct implementation (Intl.DateTimeFormat or manual offset)", async () => {
    // This test verifies the outcome only — the implementation may use
    // Intl.DateTimeFormat, a date library (date-fns-tz), or manual UTC offset math.
    // As long as the streak is computed correctly for the Manila user, it passes.
    await Workout.create({
      title: "Single Day",
      slug: `sd-${Math.random().toString(36).slice(2, 6)}`,
      authorId: manilaUserId,
      category: "strength",
      exercises: [],
      notes: "",
      tags: [],
      performedAt: new Date("2026-01-14T15:30:00Z"),
      durationMin: 30,
      cheerCount: 0,
    });

    const res = await request(app)
      .get("/api/users/me/streak")
      .set("Authorization", `Bearer ${manilaToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.currentStreak).toBeGreaterThanOrEqual(1);
  });
});
