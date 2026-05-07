import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { getTripBySlug } from "../services/trip.service";
import { listStops } from "../services/stop.service";
import { listExpenses } from "../services/expense.service";
import { listComments, createComment } from "../services/comment.service";
import type { Trip } from "../types/trip";
import type { Stop } from "../types/stop";
import type { Expense } from "../types/expense";
import type { Comment } from "../types/trip";
import { TripHeader } from "../components/trip/TripHeader";
import { DayFilter } from "../components/trip/DayFilter";
import { ItineraryFeed } from "../components/trip/ItineraryFeed";
import { ExpenseList } from "../components/trip/ExpenseList";
import { CommentThread } from "../components/trip/CommentThread";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { filterByDay, getDayKeys } from "../utils/helpers";

type TabId = "itinerary" | "expenses" | "comments";

export default function TripDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [stops, setStops] = useState<Stop[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [activeDay, setActiveDay] = useState("all");
  const [activeTab, setActiveTab] = useState<TabId>("itinerary");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    getTripBySlug(slug)
      .then(async (t) => {
        setTrip(t);
        const [s, e, c] = await Promise.all([
          listStops(t._id),
          listExpenses(t._id),
          listComments(t._id),
        ]);
        setStops(s);
        setExpenses(e);
        setComments(c);
      })
      .catch(() => setError("Failed to load trip."))
      .finally(() => setLoading(false));
  }, [slug]);

  const dayKeys = useMemo(() => getDayKeys(stops), [stops]);
  const filteredStops = useMemo(() => filterByDay(stops, activeDay), [stops, activeDay]);

  async function handleAddComment(body: string) {
    if (!trip) return;
    const comment = await createComment(trip._id, body);
    setComments((prev) => [...prev, comment]);
  }

  function handleVote(stopId: string) {
    setStops((prev) =>
      prev.map((s) => (s._id === stopId ? { ...s, voteCount: s.voteCount + 1 } : s))
    );
  }

  if (loading) return <LoadingSpinner />;
  if (error || !trip) return <p className="text-red-500 p-4">{error || "Trip not found."}</p>;

  const tabs: { id: TabId; label: string }[] = [
    { id: "itinerary", label: "Itinerary" },
    { id: "expenses", label: "Expenses" },
    { id: "comments", label: "Comments" },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <TripHeader trip={trip} />

      <div className="flex gap-4 border-b border-gray-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-sky-500 text-sky-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "itinerary" && (
        <div>
          <div className="mb-4">
            <DayFilter days={dayKeys} activeDay={activeDay} onDayChange={setActiveDay} />
          </div>
          <ItineraryFeed stops={filteredStops} tripId={trip._id} onVote={handleVote} />
        </div>
      )}

      {activeTab === "expenses" && (
        <ExpenseList expenses={expenses} currency={trip.currency} />
      )}

      {activeTab === "comments" && (
        <CommentThread comments={comments} onSubmit={handleAddComment} />
      )}
    </div>
  );
}
