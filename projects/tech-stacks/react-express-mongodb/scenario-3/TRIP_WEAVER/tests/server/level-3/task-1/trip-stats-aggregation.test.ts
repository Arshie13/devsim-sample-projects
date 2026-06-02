import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { createApp } from "../../../../server/src/app";
import {
  createTestUser,
  createTestTrip,
  createTestStop,
  createTestExpense,
  generateToken,
} from "../../testUtils";

const app = createApp();

describe("L3-T1: Trip Stats Aggregation", () => {
  let token: string;
  let tripId: string;
  let ownerId: string;

  beforeEach(async () => {
    const owner = await createTestUser({ username: "stats-owner" });
    ownerId = owner._id.toString();
    token = generateToken(ownerId);

    const trip = await createTestTrip(ownerId, {
      destinationTimezone: "UTC",
      startDate: new Date("2026-04-10T00:00:00Z"),
      endDate: new Date("2026-04-17T00:00:00Z"),
    });
    tripId = trip._id.toString();

    // 6 stops with varying voteCount, all within the trip date window
    await createTestStop(tripId, ownerId, {
      title: "Top Stop",
      voteCount: 10,
      dayDate: new Date("2026-04-12T09:00:00Z"),
    });
    await createTestStop(tripId, ownerId, {
      title: "Second Stop",
      voteCount: 7,
      dayDate: new Date("2026-04-12T10:00:00Z"),
    });
    await createTestStop(tripId, ownerId, {
      title: "Third Stop",
      voteCount: 5,
      dayDate: new Date("2026-04-13T09:00:00Z"),
    });
    await createTestStop(tripId, ownerId, {
      title: "Fourth Stop",
      voteCount: 3,
      dayDate: new Date("2026-04-14T09:00:00Z"),
    });
    await createTestStop(tripId, ownerId, {
      title: "Fifth Stop",
      voteCount: 1,
      dayDate: new Date("2026-04-15T09:00:00Z"),
    });
    await createTestStop(tripId, ownerId, {
      title: "Sixth Stop",
      voteCount: 0,
      dayDate: new Date("2026-04-16T09:00:00Z"),
    });

    // Expenses summing to 150
    await createTestExpense(tripId, ownerId, [ownerId], { amount: 100 });
    await createTestExpense(tripId, ownerId, [ownerId], { amount: 50 });
  });

  it("returns HTTP 200 with success envelope", async () => {
    const res = await request(app)
      .get(`/api/trips/${tripId}/stats`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("returns topStops sorted descending by voteCount", async () => {
    const res = await request(app)
      .get(`/api/trips/${tripId}/stats?topN=3`)
      .set("Authorization", `Bearer ${token}`);
    const { topStops } = res.body.data;
    expect(topStops).toHaveLength(3);
    expect(topStops[0].voteCount).toBeGreaterThanOrEqual(topStops[1].voteCount);
    expect(topStops[1].voteCount).toBeGreaterThanOrEqual(topStops[2].voteCount);
  });

  it("respects topN cap — returns at most topN stops", async () => {
    const res = await request(app)
      .get(`/api/trips/${tripId}/stats?topN=2`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.body.data.topStops).toHaveLength(2);
  });

  it("topStops does not include raw lookup array (no 'votes' field)", async () => {
    const res = await request(app)
      .get(`/api/trips/${tripId}/stats?topN=5`)
      .set("Authorization", `Bearer ${token}`);
    for (const stop of res.body.data.topStops) {
      expect(stop).not.toHaveProperty("votes");
    }
  });

  it("totalSpent matches the sum of trip expenses", async () => {
    const res = await request(app)
      .get(`/api/trips/${tripId}/stats`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.body.data.totalSpent).toBe(150);
  });

  it("returns 401 when unauthenticated", async () => {
    const res = await request(app).get(`/api/trips/${tripId}/stats`);
    expect(res.status).toBe(401);
  });
});
