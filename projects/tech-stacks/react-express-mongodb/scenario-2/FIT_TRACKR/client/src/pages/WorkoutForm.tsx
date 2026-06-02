import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createWorkout } from "../services/workout.service";
import type { WorkoutCategory, Exercise } from "../types/workout";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card } from "../components/ui/Card";

const CATEGORIES: WorkoutCategory[] = ["strength", "cardio", "mobility", "hiit"];

export function WorkoutForm() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<WorkoutCategory>("strength");
  const [durationMin, setDurationMin] = useState(30);
  const [notes, setNotes] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([{ name: "", sets: 3, reps: 10, weightKg: 0, durationSec: 0 }]);
  const [submitting, setSubmitting] = useState(false);

  function addExercise() {
    setExercises((prev) => [...prev, { name: "", sets: 3, reps: 10, weightKg: 0, durationSec: 0 }]);
  }

  function updateExercise(index: number, field: keyof Exercise, value: string | number) {
    setExercises((prev) => prev.map((ex, i) => (i === index ? { ...ex, [field]: value } : ex)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const workout = await createWorkout({
        title,
        category,
        durationMin,
        notes,
        exercises,
        performedAt: new Date().toISOString(),
        tags: [],
      });
      navigate(`/workouts/${workout._id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Log a Workout</h1>
      <Card>
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input label="Workout Title" value={title} onChange={(e) => setTitle(e.target.value)} required />

          <div>
            <label className="text-sm font-medium text-gray-700">Category</label>
            <div className="flex gap-2 mt-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-sm capitalize border transition-colors ${
                    category === cat ? "bg-orange-500 text-white border-orange-500" : "border-gray-300 text-gray-600 hover:border-orange-400"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Duration (minutes)"
            type="number"
            value={durationMin}
            min={1}
            onChange={(e) => setDurationMin(Number(e.target.value))}
          />

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Exercises</label>
              <Button type="button" variant="secondary" size="sm" onClick={addExercise}>+ Add</Button>
            </div>
            {exercises.map((ex, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  placeholder="Exercise name"
                  value={ex.name}
                  onChange={(e) => updateExercise(i, "name", e.target.value)}
                />
                <input
                  className="w-16 border border-gray-300 rounded-lg px-2 py-2 text-sm"
                  type="number"
                  min={1}
                  placeholder="Sets"
                  value={ex.sets}
                  onChange={(e) => updateExercise(i, "sets", Number(e.target.value))}
                />
                <input
                  className="w-16 border border-gray-300 rounded-lg px-2 py-2 text-sm"
                  type="number"
                  min={1}
                  placeholder="Reps"
                  value={ex.reps}
                  onChange={(e) => updateExercise(i, "reps", Number(e.target.value))}
                />
              </div>
            ))}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Notes</label>
            <textarea
              className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <Button type="submit" disabled={submitting || !title.trim()}>
            {submitting ? "Saving…" : "Log Workout"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
