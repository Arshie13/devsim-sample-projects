import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import mongoose from "mongoose";
import { createApp } from "../../../../server/src/app";
import {
  createTestUser,
  createTestTrip,
  createTestStop,
  Vote,
  Stop,
  generateToken,
} from "../../testUtils";

const app = createApp();

describe("L5-T1: Vote Uniqueness and Counter Drift Fix", () => {
  let ownerToken: string;
  let tripId: string;
  let stopId: string;
  let ownerId: string;

  beforeEach(async () => {
    const owner = await createTestUser({ username: "unique-vote-owner" });
    ownerId = owner._id.toString();
    ownerToken = generateToken(ownerId);
    const trip = await createTestTrip(ownerId);
    tripId = trip._id.toString();
    const stop = await createTestStop(tripId, ownerId, { voteCount: 0 });
    stopId = stop._id.toString();
  });

  it("Vote model has a compound unique index on { userId, stopId }", async () => {
    const indexes = await Vote.collection.getIndexes({ full: true });
    const hasCompoundUnique = indexes.some((idx: any) => {
      const keys = Object.keys(idx.key ?? {});
      return (
        idx.unique === true &&
        keys.includes("userId") &&
        keys.includes("stopId")
      );
    });
    expect(hasCompoundUnique).toBe(true);
  });

  it("100 concurrent votes by the same user result in exactly 1 Vote doc", async () => {
    const requests = Array.from({ length: 100 }, () =>
      request(app)
        .post(`/api/trips/${tripId}/stops/${stopId}/vote`)
        .set("Authorization", `Bearer ${ownerToken}`)
    );
    await Promise.all(requests);

    const count = await Vote.countDocuments({
      stopId: new mongoose.Types.ObjectId(stopId),
      userId: new mongoose.Types.ObjectId(ownerId),
    });
    expect(count).toBe(1);
  });

  it("stop voteCount is 1 after 100 concurrent same-user votes", async () => {
    await Promise.all(
      Array.from({ length: 100 }, () =>
        request(app)
          .post(`/api/trips/${tripId}/stops/${stopId}/vote`)
          .set("Authorization", `Bearer ${ownerToken}`)
      )
    );
    const stop = await Stop.findById(stopId);
    expect(stop?.voteCount).toBe(1);
  });

  it("votes from different users are all counted", async () => {
    const users = await Promise.all(
      Array.from({ length: 5 }, (_, i) =>
        createTestUser({ username: `concurrent-voter-${i}-${Date.now()}` })
      )
    );
    await Promise.all(
      users.map((u) =>
        request(app)
          .post(`/api/trips/${tripId}/stops/${stopId}/vote`)
          .set("Authorization", `Bearer ${generateToken(u._id.toString())}`)
      )
    );
    const stop = await Stop.findById(stopId);
    expect(stop?.voteCount).toBe(5);
  });
});
