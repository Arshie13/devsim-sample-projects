import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { RecipeCard } from "../../../../client/src/components/recipe/RecipeCard";
import type { Recipe } from "../../../../client/src/types/recipe";

const recipe: Recipe = {
  _id: "rec_lemon_tart",
  slug: "lemon-tart",
  title: "Lemon Tart",
  description: "Bright and zesty.",
  ingredients: [],
  steps: [],
  tags: ["dessert", "lemon"],
  coverImageUrl: "/recipe-nest-logo.svg",
  authorId: "u_chefa",
  author: { _id: "u_chefa", username: "chefa", name: "Chef Alex", avatarUrl: "" },
  viewCount: 0,
  savedCount: 12,
  avgRating: 4.6,
  ratingsCount: 8,
  commentCount: 2,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe("Level 2 — Task 1: RecipeCard renders required fields", () => {
  it("renders the title in an <h3>", () => {
    render(<RecipeCard recipe={recipe} />);
    expect(screen.getByRole("heading", { level: 3, name: /lemon tart/i })).toBeInTheDocument();
  });

  it("renders the author handle prefixed with @", () => {
    render(<RecipeCard recipe={recipe} />);
    expect(screen.getByText(/@chefa/)).toBeInTheDocument();
  });

  it("renders the cover image with alt equal to the recipe title", () => {
    render(<RecipeCard recipe={recipe} />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("alt", recipe.title);
  });

  it("renders one tag chip per tag", () => {
    render(<RecipeCard recipe={recipe} />);
    const chips = screen.getAllByTestId("tag-chip");
    expect(chips).toHaveLength(recipe.tags.length);
  });

  it("renders the avg rating to one decimal", () => {
    render(<RecipeCard recipe={recipe} />);
    expect(screen.getByTestId("avg-rating").textContent).toContain("4.6");
  });

  it("renders the saved count parseable as a number equal to recipe.savedCount", () => {
    render(<RecipeCard recipe={recipe} />);
    const text = screen.getByTestId("saved-count").textContent ?? "";
    const num = Number(text.replace(/[^\d]/g, ""));
    expect(num).toBe(recipe.savedCount);
  });

  it("renders without crashing when tags is empty", () => {
    const empty: Recipe = { ...recipe, tags: [] };
    render(<RecipeCard recipe={empty} />);
    expect(screen.queryAllByTestId("tag-chip")).toHaveLength(0);
  });
});
