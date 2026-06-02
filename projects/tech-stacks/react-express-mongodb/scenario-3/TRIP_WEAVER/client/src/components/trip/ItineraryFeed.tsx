import type { Stop } from "../../types/stop";
import { StopCard } from "./StopCard";

interface ItineraryFeedProps {
  stops: Stop[];
  tripId: string;
  onVote?: (stopId: string) => void;
}

export function ItineraryFeed({ stops, tripId, onVote }: ItineraryFeedProps) {
  if (stops.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-lg">No stops yet for this day.</p>
        <p className="text-sm mt-1">Add the first activity to get started!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {stops.map((stop) => (
        <StopCard
          key={stop._id}
          stop={stop}
          onVote={onVote ? () => onVote(stop._id) : undefined}
        />
      ))}
    </div>
  );
}
