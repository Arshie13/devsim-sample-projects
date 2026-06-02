export type WorkoutCategory = "strength" | "cardio" | "mobility" | "hiit";

export interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weightKg: number;
  durationSec: number;
}

export interface Workout {
  _id: string;
  slug: string;
  title: string;
  authorId: string;
  author?: {
    _id: string;
    username: string;
    name: string;
    avatarUrl: string;
    role: string;
  };
  category: WorkoutCategory;
  exercises: Exercise[];
  notes: string;
  tags: string[];
  performedAt: string;
  durationMin: number;
  cheerCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastWorkoutDate: string | null;
}
