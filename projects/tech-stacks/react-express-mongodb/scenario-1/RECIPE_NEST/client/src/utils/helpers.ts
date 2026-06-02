import type { Recipe } from "../types/recipe";

export function filterRecipes(_query: string, recipes: Recipe[]): Recipe[] {
  return recipes;
}
