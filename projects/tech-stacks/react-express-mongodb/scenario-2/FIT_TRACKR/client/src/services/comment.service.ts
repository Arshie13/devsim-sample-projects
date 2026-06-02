import { api } from "./api";

export interface Comment {
  _id: string;
  workoutId: string;
  authorId: string;
  author?: { _id: string; username: string; avatarUrl: string };
  body: string;
  createdAt: string;
}

export async function listComments(workoutId: string): Promise<Comment[]> {
  const { data } = await api.get<{ success: boolean; data: Comment[] }>(`/comments?workoutId=${workoutId}`);
  return data.data;
}

export async function createComment(workoutId: string, body: string): Promise<Comment> {
  const { data } = await api.post<{ success: boolean; data: Comment }>("/comments", { workoutId, body });
  return data.data;
}
