import type { Trip } from "../../types/trip";
import { Badge } from "../ui/Badge";
import { formatDate } from "../../utils/formatters";

interface TripHeaderProps {
  trip: Trip;
}

export function TripHeader({ trip }: TripHeaderProps) {
  return (
    <div className="mb-6">
      {trip.coverUrl && (
        <img
          src={trip.coverUrl}
          alt={trip.title}
          className="w-full h-48 object-cover rounded-xl mb-4"
        />
      )}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{trip.title}</h1>
          <p className="text-gray-500 mt-1">
            {trip.destination} · {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge variant="blue">{trip.destinationTimezone}</Badge>
          <p className="text-sm text-gray-500">
            Budget: {trip.currency} {trip.budget.toLocaleString()}
          </p>
        </div>
      </div>
      {trip.notes && <p className="mt-3 text-sm text-gray-600 italic">{trip.notes}</p>}
    </div>
  );
}
