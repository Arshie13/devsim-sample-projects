import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { createApp } from "../../../../server/src/app.js";
import { Workout } from "../../../../server/src/models/Workout.js";
import { Cheer } from "../../../../server/src/models/Cheer.js";
import { createTestUser } from "../../testUtils.js";

const app = createApp();

let token1: string;
let user1Id: any;
let token2: string;
let workoutId: string;

beforeEach(async () => {
  const a = await createTestUser({ username: "alice" });
  const b = await createTestUser({ username: "bob" });
  token1 = a.token;
  user1Id = a.user._id;
  token2 = b.token;

  const workout = await Workout.create({
    title: "Test Workout",
    slug: `test-${Math.random().toString(36).slice(2, 6)}`,
    authorId: a.user._id,
    category: "strength",
    exercises: [],
    notes: "",
    tags: [],
    performedAt: new Date(),
    durationMin: 30,
    cheerCount: 0,
  });
  workoutId = String(workout._id);
});

describe("Level 4 — Task 1: cheer/uncheer API", () => {
  it("first cheer returns 2xx and increments cheerCount by 1", async () => {
    const res = await request(app)
      .post(`/api/workouts/${workoutId}/cheer`)
      .set("Authorization", `Bearer ${token1}`);
    expect([200, 201]).toContain(res.status);
    expect(res.body.success).toBe(true);

    const workout = await Workout.findById(workoutId);
    expect(workout?.cheerCount).toBe(1);
  });

  it("duplicate cheer by same user does NOT increment cheerCount again", async () => {
    await request(app).post(`/api/workouts/${workoutId}/cheer`).set("Authorization", `Bearer ${token1}`);
    const res = await request(app).post(`/api/workouts/${workoutId}/cheer`).set("Authorization", `Bearer ${token1}`);

    expect(res.status).toBeGreaterThanOrEqual(200);
    expect(res.status).toBeLessThan(300);

    const workout = await Workout.findById(workoutId);
    expect(workout?.cheerCount).toBe(1);
  });

  it("cheer by a different user increments cheerCount by 1 more", async () => {
    await request(app).post(`/api/workouts/${workoutId}/cheer`).set("Authorization", `Bearer ${token1}`);
    await request(app).post(`/api/workouts/${workoutId}/cheer`).set("Authorization", `Bearer ${token2}`);

    const workout = await Workout.findById(workoutId);
    expect(workout?.cheerCount).toBe(2);
  });

  it("DELETE uncheer removes the Cheer doc and decrements cheerCount", async () => {
    await request(app).post(`/api/workouts/${workoutId}/cheer`).set("Authorization", `Bearer ${token1}`);
    let workout = await Workout.findById(workoutId);
    expect(workout?.cheerCount).toBe(1);

    const res = await request(app)
      .delete(`/api/workouts/${workoutId}/cheer`)
      .set("Authorization", `Bearer ${token1}`);
    expect(res.status).toBe(200);

    workout = await Workout.findById(workoutId);
    expect(workout?.cheerCount).toBe(0);

    const cheers = await Cheer.countDocuments({ userId: user1Id, workoutId });
    expect(cheers).toBe(0);
  });

  it("uncheer on a workout never cheered does not cause negative cheerCount", async () => {
    await request(app).delete(`/api/workouts/${workoutId}/cheer`).set("Authorization", `Bearer ${token1}`);
    const workout = await Workout.findById(workoutId);
    expect(workout?.cheerCount).toBeGreaterThanOrEqual(0);
  });

  it("rejects unauthenticated cheer with 401", async () => {
    const res = await request(app).post(`/api/workouts/${workoutId}/cheer`);
    expect(res.status).toBe(401);
  });

  it("returns 4xx for a non-existent workout id", async () => {
    const fakeId = "0123456789abcdef01234567";
    const res = await request(app)
      .post(`/api/workouts/${fakeId}/cheer`)
      .set("Authorization", `Bearer ${token1}`);
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.status).toBeLessThan(500);
  });
});
