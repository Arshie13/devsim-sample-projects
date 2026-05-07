import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StopCard } from "../../../../client/src/components/trip/StopCard";
import type { Stop } from "../../../../client/src/types/stop";

const mockStop: Stop = {
  _id: "stop-1",
  tripId: "trip-1",
  title: "Senso-ji Temple",
  category: "sightseeing",
  location: "Asakusa, Tokyo",
  dayDate: "2026-04-12T09:00:00.000Z",
  order: 1,
  voteCount: 7,
  suggestedBy: "user-1",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

describe("L2-T1: StopCard Component", () => {
  it("renders the stop title in an h3", () => {
    render(<StopCard stop={mockStop} />);
    expect(screen.getByRole("heading", { name: /senso-ji temple/i })).toBeInTheDocument();
  });

  it("renders the stop location", () => {
    render(<StopCard stop={mockStop} />);
    expect(screen.getByText(/asakusa/i)).toBeInTheDocument();
  });

  it("renders the category badge with data-testid='category-badge'", () => {
    render(<StopCard stop={mockStop} />);
    expect(screen.getByTestId("category-badge")).toBeInTheDocument();
  });

  it("renders the day label with data-testid='day-label'", () => {
    render(<StopCard stop={mockStop} />);
    expect(screen.getByTestId("day-label")).toBeInTheDocument();
  });

  it("renders the vote count with data-testid='vote-count'", () => {
    render(<StopCard stop={mockStop} />);
    expect(screen.getByTestId("vote-count")).toHaveTextContent("7");
  });

  it("renders a Vote button and calls onVote when clicked", async () => {
    const onVote = vi.fn();
    render(<StopCard stop={mockStop} onVote={onVote} />);
    const btn = screen.getByRole("button", { name: /vote/i });
    await userEvent.click(btn);
    expect(onVote).toHaveBeenCalledOnce();
  });
});
