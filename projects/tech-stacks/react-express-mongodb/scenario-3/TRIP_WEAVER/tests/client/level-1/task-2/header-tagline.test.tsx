import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Header } from "../../../../client/src/components/layout/Header";

function renderHeader() {
  return render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>
  );
}

describe("L1-T2: Brand Tagline", () => {
  it('displays the correct tagline "Plan Together. Travel Smarter."', () => {
    renderHeader();
    expect(screen.getByText("Plan Together. Travel Smarter.")).toBeInTheDocument();
  });

  it("does not show the placeholder text", () => {
    renderHeader();
    expect(screen.queryByText("Your Tagline Here")).not.toBeInTheDocument();
  });

  it("tagline is visible (not hidden)", () => {
    renderHeader();
    const el = screen.getByText("Plan Together. Travel Smarter.");
    expect(el).toBeVisible();
  });
});
