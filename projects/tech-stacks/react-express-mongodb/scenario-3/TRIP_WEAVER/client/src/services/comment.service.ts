import api from "./api";
import type { Comment } from "../types/trip";

export async function listComments(tripId: string): Promise<Comment[]> {
  const res = await api.get<{ success: boolean; data: Comment[] }>(
    `/trips/${tripId}/comments`
  );
  return res.data.data;
}

export async function createComment(
  tripId: string,
  body: string
): Promise<Comment> {
  const res = await api.post<{ success: boolean; data: Comment }>(
    `/trips/${tripId}/comments`,
    { body }
  );
  return res.data.data;
}
