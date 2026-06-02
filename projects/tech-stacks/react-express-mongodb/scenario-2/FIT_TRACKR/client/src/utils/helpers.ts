import type { Workout, WorkoutCategory } from "../types/workout";

export function filterByCategory(workouts: Workout[], category: WorkoutCategory | "all"): Workout[] {
  // L2-T2 BUG (intentional): this helper is not implemented yet.
  // Students must implement this so:
  //   - category === "all" returns all workouts unchanged
  //   - otherwise returns only workouts where workout.category === category
  // TODO: implement filterByCategory
  return workouts;
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}
