import { useState, useEffect, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTripBySlug } from "../services/trip.service";
import { createExpense } from "../services/expense.service";
import type { Trip } from "../types/trip";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";

export default function ExpenseForm() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [splitBetween, setSplitBetween] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;
    getTripBySlug(slug)
      .then(setTrip)
      .finally(() => setFetchLoading(false));
  }, [slug]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!trip) return;
    setError("");
    setLoading(true);
    try {
      const splitIds = splitBetween
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      await createExpense(trip._id, {
        amount: Number(amount),
        description,
        splitBetween: splitIds,
      });
      navigate(`/trips/${slug}`);
    } catch {
      setError("Failed to log expense.");
    } finally {
      setLoading(false);
    }
  }

  if (fetchLoading) return <LoadingSpinner />;
  if (!trip) return <p className="text-red-500 p-4">Trip not found.</p>;

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Log Expense</h1>
      <p className="text-sm text-gray-500 mb-6">{trip.title}</p>
      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label={`Amount (${trip.currency})`}
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <Input
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Split Between (user IDs, comma-separated)
          </label>
          <input
            type="text"
            value={splitBetween}
            onChange={(e) => setSplitBetween(e.target.value)}
            placeholder="userId1, userId2"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
            required
          />
        </div>
        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? "Logging…" : "Log Expense"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(`/trips/${slug}`)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
