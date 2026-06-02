import api from "./api";
import type { Stop, CreateStopPayload } from "../types/stop";

export async function listStops(tripId: string): Promise<Stop[]> {
  const res = await api.get<{ success: boolean; data: Stop[] }>(`/trips/${tripId}/stops`);
  return res.data.data;
}

export async function createStop(tripId: string, payload: CreateStopPayload): Promise<Stop> {
  const res = await api.post<{ success: boolean; data: Stop }>(
    `/trips/${tripId}/stops`,
    payload
  );
  return res.data.data;
}

// L4-T1 BUG (intentional): not implemented — complete Level 4 Task 1 to wire this up.
export async function voteStop(_tripId: string, _stopId: string): Promise<{ voteCount: number }> {
  throw new Error("voteStop is not implemented yet — complete Level 4 Task 1");
}

// L4-T1 BUG (intentional): not implemented — complete Level 4 Task 1 to wire this up.
export async function unvoteStop(
  _tripId: string,
  _stopId: string
): Promise<{ voteCount: number }> {
  throw new Error("unvoteStop is not implemented yet — complete Level 4 Task 1");
}
