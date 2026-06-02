interface DayFilterProps {
  days: string[];
  activeDay: string;
  onDayChange: (day: string) => void;
}

// L2-T2 BUG (intentional): chip buttons render but onClick handlers are no-ops.
// The chips never call onDayChange, so activeDay never changes.
//
// Fix: replace the empty onClick on each chip with onClick={() => onDayChange(day)}
// and the "All" chip with onClick={() => onDayChange("all")}
export function DayFilter({ days, activeDay, onDayChange }: DayFilterProps) {
  const allDays = ["all", ...days];

  return (
    <div className="flex gap-2 flex-wrap" role="group" aria-label="Filter by day">
      {allDays.map((day) => (
        <button
          key={day}
          // L2-T2 BUG (intentional): onClick is a no-op — wire to onDayChange(day)
          onClick={() => {}}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            activeDay === day
              ? "bg-sky-500 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
          aria-pressed={activeDay === day}
        >
          {day === "all" ? "All" : day}
        </button>
      ))}
    </div>
  );
}
