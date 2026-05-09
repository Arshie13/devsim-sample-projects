import { Link } from "react-router-dom";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Avatar } from "../ui/Avatar";
import type { Recipe } from "../../types/recipe";

interface Props {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: Props) {
  return (
    <article data-testid="recipe-card">
      <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
        <img
          src={recipe.coverImageUrl || "/recipe-nest-logo.svg"}
          alt={recipe.title}
          className="w-full h-40 object-cover bg-slate-100"
        />
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-slate-900 text-base leading-snug line-clamp-2">
              {recipe.title}
            </h3>
            {recipe.description && (
              <p className="text-sm text-slate-500 mt-1 line-clamp-2">{recipe.description}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Avatar
              src={recipe.author?.avatarUrl}
              name={recipe.author?.name ?? recipe.authorId}
              size={24}
            />
            <span className="text-sm text-brand-600">@{recipe.author?.username ?? ""}</span>
          </div>

          {recipe.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {recipe.tags.map((tag) => (
                <Badge key={tag} data-testid="tag-chip">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between text-sm text-slate-500 pt-1 border-t border-slate-100">
            <span data-testid="avg-rating" className="flex items-center gap-1">
              ⭐ {recipe.avgRating.toFixed(1)}
            </span>
            <span data-testid="saved-count" className="flex items-center gap-1">
              🔖 {recipe.savedCount}
            </span>
          </div>
        </div>
      </Card>
    </article>
  );
}
