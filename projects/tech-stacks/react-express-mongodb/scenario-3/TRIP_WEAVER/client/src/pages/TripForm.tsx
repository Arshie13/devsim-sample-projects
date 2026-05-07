import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { createTrip } from "../services/trip.service";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

export default function TripForm() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("");
  const [destinationTimezone, setDestinationTimezone] = useState("UTC");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const trip = await createTrip({
        title,
        destination,
        destinationTimezone,
        startDate,
        endDate,
        budget: Number(budget),
        currency,
        notes,
      });
      navigate(`/trips/${trip.slug}`);
    } catch {
      setError("Failed to create trip.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">New Trip</h1>
      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Trip Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <Input
          label="Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          required
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Destination Timezone
          </label>
          <input
            type="text"
            value={destinationTimezone}
            onChange={(e) => setDestinationTimezone(e.target.value)}
            placeholder="e.g. Asia/Tokyo"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
          <Input
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Budget"
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            required
          />
          <Input
            label="Currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
        </div>
        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? "Creating…" : "Create Trip"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/trips")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
