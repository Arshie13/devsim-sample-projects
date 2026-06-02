import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRecipe } from "../services/recipe.service";
import type { Recipe } from "../types/recipe";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { Badge } from "../components/ui/Badge";
import { IngredientList } from "../components/recipe/IngredientList";
import { StepList } from "../components/recipe/StepList";
import { RatingStars } from "../components/recipe/RatingStars";
import { CommentThread } from "../components/recipe/CommentThread";
import { formatPostedAt } from "../utils/formatters";

export function RecipeDetailPage() {
  const { id = "" } = useParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getRecipe(id).then(setRecipe).catch((err) => setError(err?.message ?? "Failed to load"));
  }, [id]);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!recipe) return <LoadingSpinner label="Loading recipe..." />;

  return (
    <article className="space-y-4">
      <header>
        <h2 className="text-3xl font-bold">{recipe.title}</h2>
        <p className="text-sm text-slate-500">
          @{recipe.author?.username ?? "unknown"} · {formatPostedAt(recipe.createdAt)}
        </p>
        <div className="mt-2 flex gap-2">
          {recipe.tags.map((t) => (
            <Badge key={t}>{t}</Badge>
          ))}
        </div>
        <div className="mt-2 flex items-center gap-3 text-sm text-slate-600">
          <RatingStars value={recipe.avgRating} />
          <span>{recipe.avgRating.toFixed(1)} ({recipe.ratingsCount})</span>
          <span>· {recipe.savedCount} saves</span>
          {/*
            L4-T1 NOTE: a <SaveButton /> component should appear here once
            implemented. The component file does not yet exist.
          */}
        </div>
      </header>

      {recipe.coverImageUrl ? (
        <img src={recipe.coverImageUrl} alt={recipe.title} className="rounded-lg w-full max-h-96 object-cover" />
      ) : null}

      <p>{recipe.description}</p>

      <section>
        <h3 className="font-semibold text-lg mb-1">Ingredients</h3>
        <IngredientList ingredients={recipe.ingredients} />
      </section>

      <section>
        <h3 className="font-semibold text-lg mb-1">Steps</h3>
        <StepList steps={recipe.steps} />
      </section>

      <CommentThread recipeId={recipe._id} />
    </article>
  );
}
