export type StopCategory =
  | "sightseeing"
  | "food"
  | "accommodation"
  | "transport"
  | "activity"
  | "other";

export interface Stop {
  _id: string;
  tripId: string;
  title: string;
  category: StopCategory;
  location: string;
  notes?: string;
  dayDate: string;
  order: number;
  voteCount: number;
  suggestedBy: string | { _id: string; name: string; username: string };
  createdAt: string;
  updatedAt: string;
}

export interface CreateStopPayload {
  title: string;
  category: StopCategory;
  location: string;
  notes?: string;
  dayDate: string;
  order?: number;
}
