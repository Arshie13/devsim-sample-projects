import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { WorkoutCard } from "../../../../client/src/components/workout/WorkoutCard";
import type { Workout } from "../../../../client/src/types/workout";

const workout: Workout = {
  _id: "w_test_1",
  slug: "heavy-squat-day",
  title: "Heavy Squat Day",
  authorId: "u_coachjules",
  author: { _id: "u_coachjules", username: "coachjules", name: "Jules Romero", avatarUrl: "", role: "coach" },
  category: "strength",
  exercises: [
    { name: "Back Squat", sets: 5, reps: 5, weightKg: 120, durationSec: 0 },
    { name: "Romanian Deadlift", sets: 3, reps: 8, weightKg: 90, durationSec: 0 },
    { name: "Leg Press", sets: 3, reps: 12, weightKg: 200, durationSec: 0 },
  ],
  notes: "Hit a new 5RM today.",
  tags: ["strength", "legs"],
  performedAt: new Date().toISOString(),
  durationMin: 70,
  cheerCount: 18,
  commentCount: 2,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe("Level 2 — Task 1: WorkoutCard renders required fields", () => {
  it("renders the title", () => {
    render(<WorkoutCard workout={workout} />);
    expect(screen.getByText(/heavy squat day/i)).toBeInTheDocument();
  });

  it("renders the author username prefixed with @", () => {
    render(<WorkoutCard workout={workout} />);
    expect(screen.getByText(/@coachjules/i)).toBeInTheDocument();
  });

  it("renders the category badge", () => {
    render(<WorkoutCard workout={workout} />);
    const badge = screen.getByTestId("category-badge");
    expect(badge).toBeInTheDocument();
    expect(badge.textContent?.toLowerCase()).toContain("strength");
  });

  it("renders the exercise count", () => {
    render(<WorkoutCard workout={workout} />);
    const countEl = screen.getByTestId("exercise-count");
    expect(countEl.textContent).toMatch(/3/);
  });

  it("renders the duration", () => {
    render(<WorkoutCard workout={workout} />);
    const durEl = screen.getByTestId("duration");
    expect(durEl.textContent).toBeTruthy();
  });

  it("renders the cheerCount as a number", () => {
    render(<WorkoutCard workout={workout} />);
    const cheerEl = screen.getByTestId("cheer-count");
    const num = Number(cheerEl.textContent?.replace(/[^\d]/g, ""));
    expect(num).toBe(workout.cheerCount);
  });

  it("renders a Cheer button", () => {
    render(<WorkoutCard workout={workout} />);
    const btn = screen.getByRole("button", { name: /cheer/i });
    expect(btn).toBeInTheDocument();
  });

  it("renders without crashing when exercises is empty", () => {
    const empty: Workout = { ...workout, exercises: [] };
    render(<WorkoutCard workout={empty} />);
    const countEl = screen.getByTestId("exercise-count");
    expect(countEl.textContent).toMatch(/0/);
  });
});
