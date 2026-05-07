import api from "./api";
import type { Trip, TripStats, TimelineDay } from "../types/trip";

export async function listTrips(): Promise<Trip[]> {
  const res = await api.get<{ success: boolean; data: Trip[] }>("/trips");
  return res.data.data;
}

export async function getTripBySlug(slug: string): Promise<Trip> {
  const res = await api.get<{ success: boolean; data: Trip }>(`/trips/${slug}`);
  return res.data.data;
}

export async function createTrip(payload: Partial<Trip>): Promise<Trip> {
  const res = await api.post<{ success: boolean; data: Trip }>("/trips", payload);
  return res.data.data;
}

export async function getTripStats(tripId: string, topN = 5): Promise<TripStats> {
  const res = await api.get<{ success: boolean; data: TripStats }>(
    `/trips/${tripId}/stats?topN=${topN}`
  );
  return res.data.data;
}

export async function getTimeline(tripId: string): Promise<TimelineDay[]> {
  const res = await api.get<{ success: boolean; data: TimelineDay[] }>(
    `/trips/${tripId}/timeline`
  );
  return res.data.data;
}
