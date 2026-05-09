import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { RecipeCard } from "../../../../client/src/components/recipe/RecipeCard";
import type { Recipe } from "../../../../client/src/types/recipe";

const recipe: Recipe = {
  _id: "69ff39bc45fbc158714ef8a0",
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

function renderCard() {
  return render(
    <MemoryRouter>
      <RecipeCard recipe={recipe} />
    </MemoryRouter>,
  );
}

describe("Level 2 — Task 1: RecipeCard navigates to recipe detail", () => {
  it("card contains a link pointing to /recipes/<id>", () => {
    renderCard();
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", `/recipes/${recipe._id}`);
  });

  it("the link wraps the card title so the whole card is the click target", () => {
    renderCard();
    const link = screen.getByRole("link");
    expect(link).toContainElement(screen.getByRole("heading", { level: 3 }));
  });

  it("link href changes when a different recipe id is used", () => {
    const other: Recipe = { ...recipe, _id: "aabbcc112233445566778899" };
    render(
      <MemoryRouter>
        <RecipeCard recipe={other} />
      </MemoryRouter>,
    );
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/recipes/aabbcc112233445566778899",
    );
  });
});
