import { api } from "./api";
import type { Workout, StreakData } from "../types/workout";

export async function listWorkouts(): Promise<Workout[]> {
  const { data } = await api.get<{ success: boolean; data: Workout[] }>("/workouts");
  return data.data;
}

export async function getWorkout(id: string): Promise<Workout> {
  const { data } = await api.get<{ success: boolean; data: Workout }>(`/workouts/${id}`);
  return data.data;
}

export async function createWorkout(payload: Partial<Workout>): Promise<Workout> {
  const { data } = await api.post<{ success: boolean; data: Workout }>("/workouts", payload);
  return data.data;
}

export async function getLeaderboard(limit = 10): Promise<unknown[]> {
  const { data } = await api.get<{ success: boolean; data: unknown[] }>(`/workouts/leaderboard?limit=${limit}`);
  return data.data;
}

// L4-T1 BUG (intentional): not implemented yet.
// Students must implement a cheer toggle that calls POST /workouts/:id/cheer
// or DELETE /workouts/:id/cheer and returns { cheered, cheerCount }.
export async function cheerWorkout(_id: string): Promise<{ cheered: boolean; cheerCount: number }> {
  throw new Error("cheerWorkout: not implemented yet (Level 4 task 1)");
}

export async function uncheerWorkout(_id: string): Promise<{ cheered: boolean; cheerCount: number }> {
  throw new Error("uncheerWorkout: not implemented yet (Level 4 task 1)");
}

// L4-T2 BUG (intentional): not implemented yet.
// Students must call GET /users/me/streak and return the StreakData.
export async function getMyStreak(): Promise<StreakData> {
  throw new Error("getMyStreak: not implemented yet (Level 4 task 2)");
}
