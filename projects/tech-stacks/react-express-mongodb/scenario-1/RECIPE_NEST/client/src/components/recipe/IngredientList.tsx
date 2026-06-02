import type { Ingredient } from "../../types/recipe";

export function IngredientList({ ingredients }: { ingredients: Ingredient[] }) {
  return (
    <ul className="list-disc pl-5 space-y-1">
      {ingredients.map((ing, i) => (
        <li key={`${ing.name}-${i}`}>
          <span className="font-medium">{ing.qty}</span> {ing.unit} {ing.name}
        </li>
      ))}
    </ul>
  );
}
