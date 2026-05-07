import type { Workout } from "../../types/workout";
import { WorkoutCard } from "./WorkoutCard";
import { LoadingSpinner } from "../ui/LoadingSpinner";

interface WorkoutFeedProps {
  workouts: Workout[];
  loading?: boolean;
}

export function WorkoutFeed({ workouts, loading }: WorkoutFeedProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (workouts.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400" data-testid="empty-feed">
        No workouts yet. Be the first to log one!
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {workouts.map((w) => (
        <WorkoutCard key={w._id} workout={w} />
      ))}
    </div>
  );
}
