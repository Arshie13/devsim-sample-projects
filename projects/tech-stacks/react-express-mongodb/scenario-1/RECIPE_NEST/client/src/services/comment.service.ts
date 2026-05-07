import { api } from "./api";
import type { ApiSuccess } from "../types/api";

export interface CommentRecord {
  _id: string;
  recipeId: string;
  authorId: { _id: string; username: string; name: string; avatarUrl?: string } | string;
  body: string;
  createdAt: string;
  updatedAt: string;
}

export async function listComments(recipeId: string): Promise<CommentRecord[]> {
  const { data } = await api.get<ApiSuccess<CommentRecord[]>>(`/comments/${recipeId}`);
  return data.data;
}

export async function postComment(recipeId: string, body: string): Promise<CommentRecord> {
  const { data } = await api.post<ApiSuccess<CommentRecord>>(`/comments/${recipeId}`, { body });
  return data.data;
}
