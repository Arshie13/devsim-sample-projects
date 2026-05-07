import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Header } from "../../../../client/src/components/layout/Header";
import { AuthProvider } from "../../../../client/src/context/AuthContext";

function renderHeader() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <Header />
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe("Level 1 — Task 2: brand tagline text", () => {
  it("renders the exact tagline 'Train. Log. Level Up.'", () => {
    renderHeader();
    expect(screen.getByText("Train. Log. Level Up.")).toBeInTheDocument();
  });

  it("tagline lives inside the page header (banner role)", () => {
    renderHeader();
    const banner = screen.getByRole("banner");
    expect(within(banner).getByText("Train. Log. Level Up.")).toBeInTheDocument();
  });
});
