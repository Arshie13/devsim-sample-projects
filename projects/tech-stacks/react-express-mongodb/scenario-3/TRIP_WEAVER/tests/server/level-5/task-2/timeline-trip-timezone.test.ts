import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { createApp } from "../../../../server/src/app";
import {
  createTestUser,
  createTestTrip,
  createTestStop,
  generateToken,
} from "../../testUtils";

const app = createApp();

// Tokyo is UTC+9. A stop at 2026-04-12T15:30:00Z is 00:30 on 2026-04-13 in Tokyo.
// A stop at 2026-04-13T15:30:00Z is 00:30 on 2026-04-14 in Tokyo.
// UTC grouping would put both on April 12 and 13 — Tokyo grouping puts them on April 13 and 14.

describe("L5-T2: Timeline Timezone-Aware Day Grouping", () => {
  let tokenManila: string;
  let tokenTokyo: string;
  let tokyoTripId: string;
  let utcTripId: string;

  beforeEach(async () => {
    // Manila user owns the Tokyo trip (per-trip tz must be used, not per-user)
    const manilaUser = await createTestUser({
      username: "tomh-manila",
      timezone: "Asia/Manila",
      homeCity: "Manila",
    });
    const tokyoUser = await createTestUser({
      username: "yuki-tokyo",
      timezone: "Asia/Tokyo",
    });

    tokenManila = generateToken(manilaUser._id.toString());
    tokenTokyo = generateToken(tokyoUser._id.toString());

    // Tokyo trip owned by Manila user
    const tokyoTrip = await createTestTrip(manilaUser._id.toString(), {
      destinationTimezone: "Asia/Tokyo",
      startDate: new Date("2026-04-10T00:00:00Z"),
      endDate: new Date("2026-04-17T00:00:00Z"),
    });
    tokyoTripId = tokyoTrip._id.toString();

    // Stop A: 2026-04-12T15:30:00Z = Apr 13 00:30 Tokyo
    await createTestStop(tokyoTripId, manilaUser._id.toString(), {
      title: "Senso-ji (night visit)",
      dayDate: new Date("2026-04-12T15:30:00Z"),
    });

    // Stop B: 2026-04-13T15:30:00Z = Apr 14 00:30 Tokyo
    await createTestStop(tokyoTripId, manilaUser._id.toString(), {
      title: "Shinjuku Gyoen",
      dayDate: new Date("2026-04-13T15:30:00Z"),
    });

    // UTC trip
    const utcTrip = await createTestTrip(manilaUser._id.toString(), {
      destinationTimezone: "UTC",
      startDate: new Date("2026-04-10T00:00:00Z"),
      endDate: new Date("2026-04-17T00:00:00Z"),
    });
    utcTripId = utcTrip._id.toString();
    await createTestStop(utcTripId, manilaUser._id.toString(), {
      title: "Big Ben",
      dayDate: new Date("2026-04-12T09:00:00Z"),
    });
  });

  it("groups Tokyo edge-of-day stops under local Tokyo dates (not UTC dates)", async () => {
    const res = await request(app)
      .get(`/api/trips/${tokyoTripId}/timeline`)
      .set("Authorization", `Bearer ${tokenManila}`);

    expect(res.status).toBe(200);
    const days: { date: string; stops: unknown[] }[] = res.body.data;
    const dates = days.map((d) => d.date);

    // Grouped by Tokyo local date — should be Apr 13 and Apr 14
    expect(dates).toContain("2026-04-13");
    expect(dates).toContain("2026-04-14");

    // Must NOT be grouped by raw UTC date (2026-04-12 for stop A, 2026-04-13 for stop B)
    // The UTC dates for the two stops are Apr 12 and Apr 13 — Tokyo local dates are Apr 13 and Apr 14.
    // If the implementation is UTC-naive, it would produce Apr 12 (stop A) — that must not appear.
    expect(dates).not.toContain("2026-04-12");
  });

  it("stop A appears under 2026-04-13 (Tokyo local date)", async () => {
    const res = await request(app)
      .get(`/api/trips/${tokyoTripId}/timeline`)
      .set("Authorization", `Bearer ${tokenManila}`);
    const days: { date: string; stops: { title: string }[] }[] = res.body.data;
    const apr13 = days.find((d) => d.date === "2026-04-13");
    expect(apr13).toBeDefined();
    expect(apr13?.stops.some((s) => s.title === "Senso-ji (night visit)")).toBe(true);
  });

  it("changing the requesting user timezone does NOT change grouping (per-trip, not per-user)", async () => {
    // Same trip, but accessed by a Tokyo-timezone user — result must be identical
    const resManila = await request(app)
      .get(`/api/trips/${tokyoTripId}/timeline`)
      .set("Authorization", `Bearer ${tokenManila}`);
    const resTokyo = await request(app)
      .get(`/api/trips/${tokyoTripId}/timeline`)
      .set("Authorization", `Bearer ${tokenTokyo}`);

    const datesManila = resManila.body.data.map((d: { date: string }) => d.date).sort();
    const datesTokyo = resTokyo.body.data.map((d: { date: string }) => d.date).sort();
    expect(datesManila).toEqual(datesTokyo);
  });

  it("UTC trip groups stops under UTC local date correctly", async () => {
    const res = await request(app)
      .get(`/api/trips/${utcTripId}/timeline`)
      .set("Authorization", `Bearer ${tokenManila}`);
    const days: { date: string }[] = res.body.data;
    expect(days.some((d) => d.date === "2026-04-12")).toBe(true);
  });

  it("returns 401 without auth", async () => {
    const res = await request(app).get(`/api/trips/${tokyoTripId}/timeline`);
    expect(res.status).toBe(401);
  });
});
