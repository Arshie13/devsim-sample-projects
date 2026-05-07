import { LoadingSpinner } from "../components/ui/LoadingSpinner";

// L4-T2 STUB (intentional): this page just renders a spinner forever.
// Students must replace it with one that:
//   - calls getSaved() on mount (after that service is implemented in L4-T1)
//   - displays each saved recipe as a card with an "Unsave" button
//   - shows an empty state with data-testid="empty-state" when no saves
//   - removes a recipe optimistically when Unsave is clicked
export function SavedRecipesPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Saved Recipes</h2>
      <LoadingSpinner label="Coming soon..." />
    </div>
  );
}
