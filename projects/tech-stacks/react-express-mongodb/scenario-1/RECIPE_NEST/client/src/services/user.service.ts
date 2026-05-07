import { api } from "./api";
import type { User } from "../types/user";
import type { Recipe } from "../types/recipe";
import type { ApiSuccess } from "../types/api";

interface ProfileResponse {
  user: User;
  recipes: Recipe[];
  followerCount: number;
  followingCount: number;
}

export async function getProfile(username: string): Promise<ProfileResponse> {
  const { data } = await api.get<ApiSuccess<ProfileResponse>>(`/users/${username}`);
  return data.data;
}

export async function followUser(userId: string) {
  const { data } = await api.post<ApiSuccess<{ following: boolean }>>(`/users/${userId}/follow`);
  return data.data;
}

export async function unfollowUser(userId: string) {
  const { data } = await api.delete<ApiSuccess<{ following: boolean }>>(`/users/${userId}/follow`);
  return data.data;
}
