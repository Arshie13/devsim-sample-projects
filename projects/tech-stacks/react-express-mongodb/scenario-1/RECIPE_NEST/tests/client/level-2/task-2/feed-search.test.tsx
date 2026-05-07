import { describe, it, expect } from "vitest";
import { filterRecipes } from "../../../../client/src/utils/helpers";
import type { Recipe } from "../../../../client/src/types/recipe";

function makeRecipe(title: string, tags: string[]): Recipe {
  return {
    _id: title,
    slug: title.toLowerCase(),
    title,
    description: "",
    ingredients: [],
    steps: [],
    tags,
    coverImageUrl: "",
    authorId: "u",
    viewCount: 0,
    savedCount: 0,
    avgRating: 0,
    ratingsCount: 0,
    commentCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

const recipes: Recipe[] = [
  makeRecipe("Pasta Primavera", ["italian", "pasta"]),
  makeRecipe("Pesto Toast", ["italian", "snack"]),
  makeRecipe("Tiramisu", ["italian", "dessert"]),
];

describe("Level 2 — Task 2: filterRecipes pure helper", () => {
  it("empty query returns the full list unchanged", () => {
    const result = filterRecipes("", recipes);
    expect(result).toHaveLength(recipes.length);
  });

  it("matches by title (case-insensitive)", () => {
    const result = filterRecipes("PASTA", recipes);
    const titles = result.map((r) => r.title);
    expect(titles).toContain("Pasta Primavera");
    expect(titles).not.toContain("Tiramisu");
  });

  it("matches by tag (case-insensitive)", () => {
    const result = filterRecipes("DESSERT", recipes);
    expect(result.map((r) => r.title)).toEqual(["Tiramisu"]);
  });

  it("returns an empty array when nothing matches", () => {
    const result = filterRecipes("xyzzz", recipes);
    expect(result).toHaveLength(0);
  });

  it("returns a new array (does not mutate the input)", () => {
    const result = filterRecipes("pasta", recipes);
    expect(result).not.toBe(recipes);
  });
});
