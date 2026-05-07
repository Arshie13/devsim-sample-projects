import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

// Mock the recipe service so the page does not hit a real network.
vi.mock("../../../../client/src/services/recipe.service", () => ({
  getSaved: vi.fn(),
  unsaveRecipe: vi.fn(),
  listRecipes: vi.fn(),
  getRecipe: vi.fn(),
  createRecipe: vi.fn(),
  getTrending: vi.fn(),
  saveRecipe: vi.fn(),
}));

import { getSaved } from "../../../../client/src/services/recipe.service";
import { SavedRecipesPage } from "../../../../client/src/pages/SavedRecipes";

describe("Level 4 — Task 2: SavedRecipesPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders an empty-state element when the user has no saves", async () => {
    (getSaved as any).mockResolvedValue([]);
    render(
      <MemoryRouter>
        <SavedRecipesPage />
      </MemoryRouter>,
    );
    const empty = await screen.findByTestId("empty-state");
    expect(empty).toBeInTheDocument();
  });

  it("renders one card per saved recipe", async () => {
    (getSaved as any).mockResolvedValue([
      { _id: "r1", title: "Lemon Tart", coverImageUrl: "", tags: [] },
      { _id: "r2", title: "Pesto Toast", coverImageUrl: "", tags: [] },
    ]);
    render(
      <MemoryRouter>
        <SavedRecipesPage />
      </MemoryRouter>,
    );
    expect(await screen.findByText("Lemon Tart")).toBeInTheDocument();
    expect(await screen.findByText("Pesto Toast")).toBeInTheDocument();
  });
});
