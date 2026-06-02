import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getWorkout } from "../services/workout.service";
import type { Workout } from "../types/workout";
import { Badge } from "../components/ui/Badge";
import { Avatar } from "../components/ui/Avatar";
import { Card } from "../components/ui/Card";
import { ExerciseList } from "../components/workout/ExerciseList";
import { CommentThread } from "../components/workout/CommentThread";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { timeAgo } from "../utils/formatters";
import { formatDuration } from "../utils/helpers";

export function WorkoutDetail() {
  const { id } = useParams<{ id: string }>();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getWorkout(id)
      .then(setWorkout)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>;
  if (!workout) return <div className="text-center py-16 text-gray-400">Workout not found.</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{workout.title}</h1>
            <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
              <Avatar initials={workout.author?.username ?? "?"} size="sm" />
              <span>@{workout.author?.username ?? "unknown"}</span>
              <span>·</span>
              <span>{timeAgo(workout.performedAt)}</span>
            </div>
          </div>
          <Badge label={workout.category} />
        </div>

        <div className="flex gap-4 text-sm text-gray-600 mb-4">
          <span>{workout.exercises.length} exercises</span>
          <span>·</span>
          <span>{formatDuration(workout.durationMin)}</span>
          <span>·</span>
          <span>{workout.cheerCount} cheers</span>
        </div>

        {workout.notes && <p className="text-gray-700 mb-4">{workout.notes}</p>}

        <ExerciseList exercises={workout.exercises} />
      </Card>

      <Card>
        <CommentThread workoutId={workout._id} />
      </Card>
    </div>
  );
}
