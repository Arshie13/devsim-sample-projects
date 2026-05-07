import { api } from "./api";
import type { Recipe } from "../types/recipe";
import type { ApiSuccess } from "../types/api";

export async function listRecipes(): Promise<Recipe[]> {
  const { data } = await api.get<ApiSuccess<Recipe[]>>("/recipes");
  return data.data;
}

export async function getRecipe(id: string): Promise<Recipe> {
  const { data } = await api.get<ApiSuccess<Recipe>>(`/recipes/${id}`);
  return data.data;
}

export async function createRecipe(input: Partial<Recipe>): Promise<Recipe> {
  const { data } = await api.post<ApiSuccess<Recipe>>("/recipes", input);
  return data.data;
}

export async function getTrending(limit = 10): Promise<Recipe[]> {
  const { data } = await api.get<ApiSuccess<Recipe[]>>(`/recipes/trending?limit=${limit}`);
  return data.data;
}

// L4-T1 BUG (intentional): not implemented yet.
// Students must implement this to POST /api/recipes/:id/save and return the
// updated saved-state.
export async function saveRecipe(_recipeId: string): Promise<{ saved: boolean; savedCount: number }> {
  throw new Error("saveRecipe: not implemented yet (Level 4 task 1)");
}

// L4-T2 BUG (intentional): not implemented yet.
export async function getSaved(): Promise<Recipe[]> {
  throw new Error("getSaved: not implemented yet (Level 4 task 2)");
}

// L4-T2 BUG (intentional): not implemented yet.
export async function unsaveRecipe(_recipeId: string): Promise<{ saved: boolean; savedCount: number }> {
  throw new Error("unsaveRecipe: not implemented yet (Level 4 task 2)");
}
