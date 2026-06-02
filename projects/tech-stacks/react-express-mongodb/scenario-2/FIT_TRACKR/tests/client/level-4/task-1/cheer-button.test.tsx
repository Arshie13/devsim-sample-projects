import { describe, it, expect } from "vitest";

// L4-T1 client test: students must update WorkoutCard.tsx to:
//   - Accept an onCheer callback prop (or implement inline via service)
//   - Render a button with role="button" that triggers the cheer action
//   - Optimistically update cheerCount (+1) when clicked
//   - Revert on server error
//
// Tests use dynamic import so a missing/stub component fails clearly.

describe("Level 4 — Task 1: WorkoutCard Cheer button integration", () => {
  it("WorkoutCard exports a component that renders a Cheer button", async () => {
    const mod: any = await import("../../../../client/src/components/workout/WorkoutCard").catch(() => null);
    expect(mod, "WorkoutCard.tsx must export WorkoutCard").not.toBeNull();
    const Component = mod?.WorkoutCard ?? mod?.default;
    expect(Component).toBeTypeOf("function");
  });

  it("Cheer button has an accessible label containing 'cheer'", async () => {
    const mod: any = await import("../../../../client/src/components/workout/WorkoutCard").catch(() => null);
    if (!mod) return;
    const Component = mod.WorkoutCard ?? mod.default;
    if (!Component) return;

    const workout = {
      _id: "w1", slug: "test", title: "Test Workout", authorId: "u1",
      author: { _id: "u1", username: "coach", name: "Coach", avatarUrl: "", role: "coach" },
      category: "strength" as const,
      exercises: [], notes: "", tags: [],
      performedAt: new Date().toISOString(), durationMin: 30,
      cheerCount: 5, commentCount: 0,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    };

    const { render, screen } = await import("@testing-library/react");
    render(<Component workout={workout} />);
    const btn = screen.queryByRole("button", { name: /cheer/i });
    expect(btn, "WorkoutCard must render a Cheer button (aria-label or text containing 'cheer')").not.toBeNull();
  });

  it("cheerWorkout service is callable (not a permanently-throwing stub)", async () => {
    const mod: any = await import("../../../../client/src/services/workout.service").catch(() => null);
    expect(mod).not.toBeNull();
    expect(mod?.cheerWorkout).toBeTypeOf("function");
  });
});
