import type { Workout } from "../../types/workout";

interface WorkoutCardProps {
  workout: Workout;
  onCheer?: (id: string) => void;
}

// L2-T1 BUG (intentional): This component is a stub.
// Students must implement it so it renders all required workout fields:
//   - title (in an <h3>)
//   - author username (prefixed with @)
//   - category badge (data-testid="category-badge")
//   - exercise count text, e.g. "3 exercises" (data-testid="exercise-count")
//   - duration text, e.g. "45m" (data-testid="duration")
//   - cheerCount (data-testid="cheer-count")
//   - a Cheer button with aria-label referencing "cheer" (for L4-T1)
//
// Existing UI primitives to reuse: Card, Badge, Avatar, Button from ../ui/
// TODO: implement WorkoutCard
export function WorkoutCard(_props: WorkoutCardProps) {
  return null;
}
