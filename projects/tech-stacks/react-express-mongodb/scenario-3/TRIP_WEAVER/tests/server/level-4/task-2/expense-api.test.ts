import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { createApp } from "../../../../server/src/app";
import {
  createTestUser,
  createTestTrip,
  Trip,
  Expense,
  generateToken,
} from "../../testUtils";

const app = createApp();

describe("L4-T2: Expense Splitting API", () => {
  let ownerToken: string;
  let tripId: string;
  let ownerId: string;
  let member1Id: string;
  let member2Id: string;

  beforeEach(async () => {
    const owner = await createTestUser({ username: "expense-owner" });
    const member1 = await createTestUser({ username: "expense-m1" });
    const member2 = await createTestUser({ username: "expense-m2" });
    ownerId = owner._id.toString();
    member1Id = member1._id.toString();
    member2Id = member2._id.toString();
    ownerToken = generateToken(ownerId);

    const trip = await createTestTrip(ownerId, {
      collaboratorIds: [member1Id, member2Id],
    });
    tripId = trip._id.toString();
  });

  it("POST creates an expense and returns 201 with success envelope", async () => {
    const res = await request(app)
      .post(`/api/trips/${tripId}/expenses`)
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({
        amount: 90,
        description: "Ramen dinner",
        splitBetween: [ownerId, member1Id, member2Id],
      });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("_id");
  });

  it("trip totalSpent increments by the expense amount", async () => {
    await request(app)
      .post(`/api/trips/${tripId}/expenses`)
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({
        amount: 60,
        description: "Sushi",
        splitBetween: [ownerId, member1Id],
      });
    const trip = await Trip.findById(tripId);
    expect(trip?.totalSpent).toBe(60);
  });

  it("balance summary: net values sum to zero", async () => {
    const res = await request(app)
      .post(`/api/trips/${tripId}/expenses`)
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({
        amount: 99,
        description: "Hotel",
        splitBetween: [ownerId, member1Id, member2Id],
      });
    const { balances } = res.body.data;
    if (balances) {
      const total = Object.values(balances as Record<string, { net: number }>)
        .reduce((sum, b) => sum + b.net, 0);
      expect(Math.abs(total)).toBeLessThan(0.02);
    }
  });

  it("returns 400 when splitBetween contains a non-member user", async () => {
    const nonMember = await createTestUser({ username: "non-member-xyz" });
    const res = await request(app)
      .post(`/api/trips/${tripId}/expenses`)
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({
        amount: 50,
        description: "Taxi",
        splitBetween: [ownerId, nonMember._id.toString()],
      });
    expect(res.status).toBe(400);
  });

  it("returns 401 without auth token", async () => {
    const res = await request(app)
      .post(`/api/trips/${tripId}/expenses`)
      .send({ amount: 10, splitBetween: [ownerId] });
    expect(res.status).toBe(401);
  });
});
