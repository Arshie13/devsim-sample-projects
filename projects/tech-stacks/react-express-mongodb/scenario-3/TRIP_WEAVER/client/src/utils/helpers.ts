import type { Stop } from "../types/stop";

// L2-T2 BUG (intentional): filterByDay always returns all items — it ignores dayKey.
// Fix: when dayKey === "all" return items; otherwise return items where
//   new Date(s.dayDate).toISOString().slice(0, 10) === dayKey
export function filterByDay(items: Stop[], _dayKey: string): Stop[] {
  return items;
}

export function getDayKeys(stops: Stop[]): string[] {
  const seen = new Set<string>();
  for (const s of stops) {
    seen.add(new Date(s.dayDate).toISOString().slice(0, 10));
  }
  return Array.from(seen).sort();
}
