import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { createApp } from "../../../../server/src/app.js";
import { Workout } from "../../../../server/src/models/Workout.js";
import { Cheer } from "../../../../server/src/models/Cheer.js";
import { createTestUser } from "../../testUtils.js";

const app = createApp();

let token: string;
let userId: any;
let workoutId: string;

beforeEach(async () => {
  const a = await createTestUser({ username: "alice" });
  token = a.token;
  userId = a.user._id;
  // Sync indexes so the unique compound index, if added, is enforced
  await Cheer.syncIndexes();
  const workout = await Workout.create({
    title: "Hot Workout",
    slug: `hot-${Math.random().toString(36).slice(2, 6)}`,
    authorId: a.user._id,
    category: "hiit",
    exercises: [],
    notes: "",
    tags: [],
    performedAt: new Date(),
    durationMin: 20,
    cheerCount: 0,
  });
  workoutId = String(workout._id);
});

describe("Level 5 — Task 1: cheer duplicate & counter drift", () => {
  it("Cheer collection has a compound unique index on { userId, workoutId }", async () => {
    const indexes = await Cheer.collection.indexes();
    const compound = indexes.find(
      (idx: any) =>
        idx.key &&
        Object.keys(idx.key).includes("userId") &&
        Object.keys(idx.key).includes("workoutId") &&
        idx.unique === true,
    );
    expect(
      compound,
      "Add `CheerSchema.index({ userId: 1, workoutId: 1 }, { unique: true })` on the Cheer model",
    ).toBeTruthy();
  });

  it("100 concurrent cheer calls from the same user produce exactly 1 Cheer document", async () => {
    const requests = Array.from({ length: 100 }, () =>
      request(app)
        .post(`/api/workouts/${workoutId}/cheer`)
        .set("Authorization", `Bearer ${token}`),
    );
    await Promise.all(requests);

    const cheers = await Cheer.countDocuments({ userId, workoutId });
    expect(cheers).toBe(1);
  });

  it("after the same race, workout.cheerCount === 1 (no counter drift)", async () => {
    const requests = Array.from({ length: 100 }, () =>
      request(app)
        .post(`/api/workouts/${workoutId}/cheer`)
        .set("Authorization", `Bearer ${token}`),
    );
    await Promise.all(requests);

    const workout = await Workout.findById(workoutId);
    expect(workout?.cheerCount).toBe(1);
  });
});
