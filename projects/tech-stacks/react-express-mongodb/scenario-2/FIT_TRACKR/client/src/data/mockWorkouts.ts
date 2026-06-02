import type { Workout } from "../types/workout";

export const mockWorkouts: Workout[] = [
  {
    _id: "w1",
    slug: "morning-strength-blast",
    title: "Morning Strength Blast",
    authorId: "u1",
    author: { _id: "u1", username: "coachjules", name: "Jules Romero", avatarUrl: "", role: "coach" },
    category: "strength",
    exercises: [
      { name: "Back Squat", sets: 4, reps: 6, weightKg: 100, durationSec: 0 },
      { name: "Bench Press", sets: 3, reps: 8, weightKg: 80, durationSec: 0 },
    ],
    notes: "Focus on depth on squats.",
    tags: ["strength", "morning"],
    performedAt: new Date().toISOString(),
    durationMin: 55,
    cheerCount: 14,
    commentCount: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
