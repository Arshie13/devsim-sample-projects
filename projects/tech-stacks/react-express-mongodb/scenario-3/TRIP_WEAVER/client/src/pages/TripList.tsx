import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listTrips } from "../services/trip.service";
import type { Trip } from "../types/trip";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { formatDate, formatBudget } from "../utils/formatters";

export default function TripList() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    listTrips()
      .then(setTrips)
      .catch(() => setError("Failed to load trips."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-red-500 p-4">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Trips</h1>
        <Link
          to="/trips/new"
          className="px-4 py-2 bg-sky-500 text-white rounded-lg text-sm font-medium hover:bg-sky-600 transition-colors"
        >
          + New Trip
        </Link>
      </div>
      {trips.length === 0 ? (
        <p className="text-gray-400 text-center py-16">No trips yet. Create your first one!</p>
      ) : (
        <div className="flex flex-col gap-4">
          {trips.map((trip) => (
            <Link key={trip._id} to={`/trips/${trip.slug}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start gap-4">
                  {trip.coverUrl && (
                    <img
                      src={trip.coverUrl}
                      alt={trip.title}
                      className="w-20 h-16 object-cover rounded-lg flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="font-semibold text-gray-900 truncate">{trip.title}</h2>
                      <Badge variant="blue">{trip.destinationTimezone}</Badge>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {trip.destination} · {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatBudget(trip.budget, trip.currency)} budget · {trip.stopCount} stops
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
