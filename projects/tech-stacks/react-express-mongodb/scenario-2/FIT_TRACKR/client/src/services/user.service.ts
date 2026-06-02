import { api } from "./api";
import type { User } from "../types/user";
import type { Workout } from "../types/workout";

export async function getUserProfile(username: string): Promise<{ user: User; workouts: Workout[] }> {
  const { data } = await api.get<{ success: boolean; data: { user: User; workouts: Workout[] } }>(`/users/${username}`);
  return data.data;
}
