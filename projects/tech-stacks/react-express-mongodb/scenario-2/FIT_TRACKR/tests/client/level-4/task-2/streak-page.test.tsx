import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

vi.mock("../../../../client/src/services/workout.service", () => ({
  getMyStreak: vi.fn(),
  listWorkouts: vi.fn(),
  getWorkout: vi.fn(),
  createWorkout: vi.fn(),
  getLeaderboard: vi.fn(),
  cheerWorkout: vi.fn(),
  uncheerWorkout: vi.fn(),
}));

vi.mock("../../../../client/src/context/AuthContext", () => ({
  useAuth: () => ({
    user: { _id: "u1", username: "tomh", name: "Tom Harada", email: "t@t.com" },
    token: "fake-token",
    isLoading: false,
    login: vi.fn(),
    logout: vi.fn(),
  }),
  AuthProvider: ({ children }: any) => children,
}));

import { getMyStreak } from "../../../../client/src/services/workout.service";
import { MyStreak } from "../../../../client/src/pages/MyStreak";

describe("Level 4 — Task 2: MyStreak page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("displays currentStreak and longestStreak numbers from the API", async () => {
    (getMyStreak as any).mockResolvedValue({
      currentStreak: 5,
      longestStreak: 12,
      lastWorkoutDate: "2026-05-06",
    });

    render(
      <MemoryRouter>
        <MyStreak />
      </MemoryRouter>,
    );

    const current = await screen.findByTestId("current-streak");
    expect(current.textContent).toMatch(/5/);

    const longest = await screen.findByTestId("longest-streak");
    expect(longest.textContent).toMatch(/12/);
  });

  it("renders a zero/empty state when currentStreak is 0", async () => {
    (getMyStreak as any).mockResolvedValue({
      currentStreak: 0,
      longestStreak: 0,
      lastWorkoutDate: null,
    });

    render(
      <MemoryRouter>
        <MyStreak />
      </MemoryRouter>,
    );

    const emptyOrZero = await screen.findByTestId(/empty-streak|current-streak/);
    expect(emptyOrZero).toBeInTheDocument();
  });

  it("calls getMyStreak exactly once on mount", async () => {
    (getMyStreak as any).mockResolvedValue({ currentStreak: 3, longestStreak: 7, lastWorkoutDate: "2026-05-04" });
    render(<MemoryRouter><MyStreak /></MemoryRouter>);
    await screen.findByTestId("current-streak");
    expect(getMyStreak).toHaveBeenCalledTimes(1);
  });
});
