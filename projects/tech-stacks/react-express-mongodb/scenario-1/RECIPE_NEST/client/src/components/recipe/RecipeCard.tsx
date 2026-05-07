import type { Recipe } from "../../types/recipe";

interface Props {
  recipe: Recipe;
}

// L2-T1 BUG (intentional): this component is a stub.
// The required final implementation must render an <article> with
// data-testid="recipe-card" containing:
//   - the title in an <h3>
//   - the author handle prefixed with "@"
//   - the cover <img> with alt={title}
//   - one tag chip per recipe.tag with data-testid="tag-chip"
//   - data-testid="avg-rating" showing avgRating to one decimal
//   - data-testid="saved-count" showing the saved count
//
// Tests in tests/client/level-2/task-1 verify all of the above.
export function RecipeCard({ recipe }: Props) {
  return <div>TODO RecipeCard ({recipe.title})</div>;
}
