import type { Recipe } from "../types/recipe";

// L2-T2 BUG (intentional): this filter is a no-op.
// Students must implement a case-insensitive filter that matches if the
// query is a substring of the recipe title OR any of its tags.
// An empty query should return the full list unchanged.
//
// Tests cover:
//   - empty query returns full list
//   - case-insensitive title match
//   - case-insensitive tag match
//   - no-match returns empty array
export function filterRecipes(_query: string, recipes: Recipe[]): Recipe[] {
  return recipes;
}
