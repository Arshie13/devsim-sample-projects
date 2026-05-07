import { useEffect, useState } from "react";
import type { Recipe } from "../../types/recipe";
import { listRecipes } from "../../services/recipe.service";
import { RecipeCard } from "./RecipeCard";
import { SearchBar } from "./SearchBar";
import { LoadingSpinner } from "../ui/LoadingSpinner";

// L2-T2 NOTE: this component currently renders the SearchBar but does NOT pass
// it value/onChange props, and does NOT use filterRecipes() to derive the
// rendered list. Students must wire those together in Level 2 task 2.
export function RecipeFeed() {
  const [recipes, setRecipes] = useState<Recipe[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    listRecipes()
      .then((data) => {
        if (!cancelled) setRecipes(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message ?? "Failed to load recipes");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!recipes) return <LoadingSpinner label="Loading recipes..." />;

  const visible = recipes;

  return (
    <div className="space-y-6">
      <SearchBar />
      {visible.length === 0 ? (
        <div data-testid="empty-state" className="text-slate-500">
          No recipes match your search.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((r) => (
            <RecipeCard key={r._id} recipe={r} />
          ))}
        </div>
      )}
    </div>
  );
}
