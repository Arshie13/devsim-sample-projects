import { describe, it, expect } from "vitest";
import { daysAgo } from "../../../../client/src/utils/formatters";

// Output-oriented tests. Multiple correct implementations are acceptable as long as
// they satisfy the contract:
//   - elapsed < 24h           → "Posted today"
//   - elapsed >= 24h * N      → "Posted N day(s) ago"  (N = Math.floor(elapsed/86400000))
// The function MUST take an explicit `now` parameter so it is deterministic.

describe("Level 5 — Task 2: daysAgo timezone-safe helper", () => {
  it("returns 'Posted today' when posted at the same instant as now", () => {
    const now = new Date("2026-05-05T12:00:00.000Z");
    const result = daysAgo(now, "2026-05-05T12:00:00.000Z");
    expect(result.toLowerCase()).toContain("today");
  });

  it("returns 'Posted today' for 23h59m elapsed (still under 24h)", () => {
    const now = new Date("2026-05-05T23:59:00.000Z");
    const result = daysAgo(now, "2026-05-05T00:00:00.000Z");
    expect(result.toLowerCase()).toContain("today");
  });

  it("returns 'Posted 1 day ago' when exactly 24h has elapsed", () => {
    const now = new Date("2026-05-06T00:00:00.000Z");
    const result = daysAgo(now, "2026-05-05T00:00:00.000Z");
    expect(result).toMatch(/posted 1 day/i);
  });

  it("still 'Posted 1 day ago' for 24h01m (floor, not round)", () => {
    const now = new Date("2026-05-06T00:01:00.000Z");
    const result = daysAgo(now, "2026-05-05T00:00:00.000Z");
    expect(result).toMatch(/posted 1 day/i);
  });

  it("returns 'Posted 2 days ago' when 48h has elapsed", () => {
    const now = new Date("2026-05-07T00:00:00.000Z");
    const result = daysAgo(now, "2026-05-05T00:00:00.000Z");
    expect(result).toMatch(/posted 2 day/i);
  });

  it("does not flip across DST transitions (deterministic on raw timestamps)", () => {
    // Spring forward in Europe/Madrid: Mar 30 2026 01:00 UTC → 03:00 local.
    // We assert the helper uses raw UTC timestamps — same elapsed ms means same answer.
    const before = daysAgo(new Date("2026-03-29T03:00:00.000Z"), "2026-03-28T03:00:00.000Z");
    const after = daysAgo(new Date("2026-03-31T03:00:00.000Z"), "2026-03-30T03:00:00.000Z");
    expect(before).toBe(after);
  });
});
