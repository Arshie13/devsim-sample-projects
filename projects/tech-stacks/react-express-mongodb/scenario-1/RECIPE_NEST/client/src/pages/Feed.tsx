import { RecipeFeed } from "../components/recipe/RecipeFeed";

export function FeedPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Latest Recipes</h2>
      <RecipeFeed />
    </div>
  );
}
