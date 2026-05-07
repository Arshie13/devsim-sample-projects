import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DayFilter } from "../../../../client/src/components/trip/DayFilter";

const days = ["2026-04-10", "2026-04-11", "2026-04-12"];

describe("L2-T2: DayFilter Component", () => {
  it("renders an 'All' chip", () => {
    render(<DayFilter days={days} activeDay="all" onDayChange={() => {}} />);
    expect(screen.getByRole("button", { name: /all/i })).toBeInTheDocument();
  });

  it("renders a chip for each day", () => {
    render(<DayFilter days={days} activeDay="all" onDayChange={() => {}} />);
    expect(screen.getAllByRole("button")).toHaveLength(days.length + 1);
  });

  it("calls onDayChange with the selected day when a day chip is clicked", async () => {
    const onDayChange = vi.fn();
    render(<DayFilter days={days} activeDay="all" onDayChange={onDayChange} />);
    await userEvent.click(screen.getByRole("button", { name: "2026-04-11" }));
    expect(onDayChange).toHaveBeenCalledWith("2026-04-11");
  });

  it("calls onDayChange with 'all' when the All chip is clicked", async () => {
    const onDayChange = vi.fn();
    render(<DayFilter days={days} activeDay="2026-04-10" onDayChange={onDayChange} />);
    await userEvent.click(screen.getByRole("button", { name: /all/i }));
    expect(onDayChange).toHaveBeenCalledWith("all");
  });

  it("active chip has aria-pressed=true", () => {
    render(<DayFilter days={days} activeDay="2026-04-11" onDayChange={() => {}} />);
    const activeBtn = screen.getByRole("button", { name: "2026-04-11" });
    expect(activeBtn).toHaveAttribute("aria-pressed", "true");
  });
});
