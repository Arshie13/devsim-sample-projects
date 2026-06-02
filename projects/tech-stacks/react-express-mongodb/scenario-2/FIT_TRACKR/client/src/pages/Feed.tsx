import { useState, useEffect } from "react";
import { listWorkouts } from "../services/workout.service";
import type { Workout, WorkoutCategory } from "../types/workout";
import { WorkoutFeed } from "../components/workout/WorkoutFeed";
import { CategoryFilter } from "../components/workout/CategoryFilter";

// L2-T2 BUG (intentional): CategoryFilter state is not wired here.
// Students must:
//   1. Add a useState for active category ("all" | WorkoutCategory)
//   2. Pass the state and setter to <CategoryFilter />
//   3. Use filterByCategory() from utils/helpers to filter workouts before
//      passing them to <WorkoutFeed />
export function Feed() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listWorkouts()
      .then(setWorkouts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Community Workouts</h1>
      </div>

      {/* TODO (L2-T2): render <CategoryFilter /> here with active state wired */}

      <WorkoutFeed workouts={workouts} loading={loading} />
    </div>
  );
}
