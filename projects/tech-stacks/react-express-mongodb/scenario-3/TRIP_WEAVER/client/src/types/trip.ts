export interface Trip {
  _id: string;
  title: string;
  slug: string;
  ownerId: string | { _id: string; name: string; username: string };
  collaboratorIds: Array<string | { _id: string; name: string; username: string }>;
  destination: string;
  destinationTimezone: string;
  startDate: string;
  endDate: string;
  budget: number;
  currency: string;
  coverUrl?: string;
  notes?: string;
  stopCount: number;
  totalSpent: number;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  tripId?: string;
  stopId?: string;
  authorId: string | { _id: string; name: string; username: string };
  body: string;
  createdAt: string;
  updatedAt: string;
}

export interface TripStats {
  topStops: Array<{
    _id: string;
    title: string;
    voteCount: number;
    category: string;
    location: string;
  }>;
  totalSpent: number;
  currency: string;
}

export interface TimelineDay {
  date: string;
  stops: import("./stop").Stop[];
}
