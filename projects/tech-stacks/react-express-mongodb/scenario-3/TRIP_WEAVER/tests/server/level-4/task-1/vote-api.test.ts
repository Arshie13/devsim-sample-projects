import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { createApp } from "../../../../server/src/app";
import {
  createTestUser,
  createTestTrip,
  createTestStop,
  Stop,
  generateToken,
} from "../../testUtils";

const app = createApp();

describe("L4-T1: Vote / Unvote API", () => {
  let ownerToken: string;
  let otherToken: string;
  let tripId: string;
  let stopId: string;
  let ownerId: string;
  let otherId: string;

  beforeEach(async () => {
    const owner = await createTestUser({ username: "vote-owner" });
    const other = await createTestUser({ username: "vote-other" });
    ownerId = owner._id.toString();
    otherId = other._id.toString();
    ownerToken = generateToken(ownerId);
    otherToken = generateToken(otherId);

    const trip = await createTestTrip(ownerId, {
      collaboratorIds: [otherId],
    });
    tripId = trip._id.toString();

    const stop = await createTestStop(tripId, ownerId, { voteCount: 0 });
    stopId = stop._id.toString();
  });

  it("first POST vote increments voteCount to 1", async () => {
    const res = await request(app)
      .post(`/api/trips/${tripId}/stops/${stopId}/vote`)
      .set("Authorization", `Bearer ${ownerToken}`);
    expect(res.status).toBe(200);
    const stop = await Stop.findById(stopId);
    expect(stop?.voteCount).toBe(1);
  });

  it("duplicate POST by same user does not double-count (idempotent)", async () => {
    await request(app)
      .post(`/api/trips/${tripId}/stops/${stopId}/vote`)
      .set("Authorization", `Bearer ${ownerToken}`);
    await request(app)
      .post(`/api/trips/${tripId}/stops/${stopId}/vote`)
      .set("Authorization", `Bearer ${ownerToken}`);
    const stop = await Stop.findById(stopId);
    expect(stop?.voteCount).toBe(1);
  });

  it("a different user's vote increments to 2", async () => {
    await request(app)
      .post(`/api/trips/${tripId}/stops/${stopId}/vote`)
      .set("Authorization", `Bearer ${ownerToken}`);
    await request(app)
      .post(`/api/trips/${tripId}/stops/${stopId}/vote`)
      .set("Authorization", `Bearer ${otherToken}`);
    const stop = await Stop.findById(stopId);
    expect(stop?.voteCount).toBe(2);
  });

  it("DELETE unvote decrements count back", async () => {
    await request(app)
      .post(`/api/trips/${tripId}/stops/${stopId}/vote`)
      .set("Authorization", `Bearer ${ownerToken}`);
    await request(app)
      .delete(`/api/trips/${tripId}/stops/${stopId}/vote`)
      .set("Authorization", `Bearer ${ownerToken}`);
    const stop = await Stop.findById(stopId);
    expect(stop?.voteCount).toBe(0);
  });

  it("unvoting when already at 0 does not go negative", async () => {
    await request(app)
      .delete(`/api/trips/${tripId}/stops/${stopId}/vote`)
      .set("Authorization", `Bearer ${ownerToken}`);
    const stop = await Stop.findById(stopId);
    expect(stop?.voteCount).toBeGreaterThanOrEqual(0);
  });

  it("returns 401 without auth token", async () => {
    const res = await request(app).post(`/api/trips/${tripId}/stops/${stopId}/vote`);
    expect(res.status).toBe(401);
  });
});
