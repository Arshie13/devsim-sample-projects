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

describe("Level 1 — Task 2: brand subtitle text", () => {
  it("renders the exact subtitle 'Cook. Share. Inspire.'", () => {
    renderHeader();
    expect(screen.getByText("Cook. Share. Inspire.")).toBeInTheDocument();
  });

  it("subtitle lives inside the page header (banner role)", () => {
    renderHeader();
    const banner = screen.getByRole("banner");
    expect(within(banner).getByText("Cook. Share. Inspire.")).toBeInTheDocument();
  });
});
