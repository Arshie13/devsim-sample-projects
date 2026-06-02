import type { WorkoutCategory } from "../../types/workout";

interface CategoryFilterProps {
  active: WorkoutCategory | "all";
  onChange: (cat: WorkoutCategory | "all") => void;
}

const CATEGORIES: Array<WorkoutCategory | "all"> = ["all", "strength", "cardio", "mobility", "hiit"];

// L2-T2 BUG (intentional): This component is a stub.
// Students must render a chip/button group with all categories from CATEGORIES.
// The active category chip should appear visually selected.
// Clicking a chip calls onChange(category).
// TODO: implement CategoryFilter
export function CategoryFilter(_props: CategoryFilterProps) {
  return null;
}
