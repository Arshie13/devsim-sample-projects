import { describe, it, expect } from "vitest";
import { filterByCategory } from "../../../../client/src/utils/helpers";
import type { Workout } from "../../../../client/src/types/workout";

function makeWorkout(id: string, category: Workout["category"]): Workout {
  return {
    _id: id,
    slug: id,
    title: id,
    authorId: "u1",
    category,
    exercises: [],
    notes: "",
    tags: [],
    performedAt: new Date().toISOString(),
    durationMin: 30,
    cheerCount: 0,
    commentCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

const workouts: Workout[] = [
  makeWorkout("w1", "strength"),
  makeWorkout("w2", "cardio"),
  makeWorkout("w3", "strength"),
  makeWorkout("w4", "mobility"),
  makeWorkout("w5", "hiit"),
];

describe("Level 2 — Task 2: filterByCategory pure helper", () => {
  it("'all' returns the full list unchanged", () => {
    const result = filterByCategory(workouts, "all");
    expect(result).toHaveLength(workouts.length);
  });

  it("filters correctly for 'strength'", () => {
    const result = filterByCategory(workouts, "strength");
    expect(result).toHaveLength(2);
    result.forEach((w) => expect(w.category).toBe("strength"));
  });

  it("filters correctly for 'cardio'", () => {
    const result = filterByCategory(workouts, "cardio");
    expect(result).toHaveLength(1);
    expect(result[0]._id).toBe("w2");
  });

  it("returns an empty array when no workouts match", () => {
    const result = filterByCategory([workouts[0]!], "hiit");
    expect(result).toHaveLength(0);
  });

  it("returns a new array and does not mutate the input", () => {
    const result = filterByCategory(workouts, "mobility");
    expect(result).not.toBe(workouts);
    expect(workouts).toHaveLength(5);
  });

  it("handles an empty input array gracefully", () => {
    const result = filterByCategory([], "strength");
    expect(result).toHaveLength(0);
  });

  it("repeated calls with same args return same output (pure function)", () => {
    const r1 = filterByCategory(workouts, "hiit");
    const r2 = filterByCategory(workouts, "hiit");
    expect(r1).toEqual(r2);
  });
});
