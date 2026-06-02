import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { createApp } from "../../../../server/src/app";
import { createTestUser, createTestTrip, generateToken } from "../../testUtils";

const app = createApp();

describe("L3-T2: Stats Endpoint Hardening", () => {
  let token: string;
  let tripId: string;

  beforeEach(async () => {
    const owner = await createTestUser({ username: "harden-owner" });
    token = generateToken(owner._id.toString());
    const trip = await createTestTrip(owner._id.toString());
    tripId = trip._id.toString();
  });

  it("returns 400 when topN=0", async () => {
    const res = await request(app)
      .get(`/api/trips/${tripId}/stats?topN=0`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(400);
  });

  it("returns 400 when topN exceeds max (999)", async () => {
    const res = await request(app)
      .get(`/api/trips/${tripId}/stats?topN=999`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(400);
  });

  it("returns 400 when topN is not a number", async () => {
    const res = await request(app)
      .get(`/api/trips/${tripId}/stats?topN=abc`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(400);
  });

  it("successful response has { success: true, data: {...} } envelope", async () => {
    const res = await request(app)
      .get(`/api/trips/${tripId}/stats?topN=5`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("data");
  });

  it("response data contains topStops array and totalSpent", async () => {
    const res = await request(app)
      .get(`/api/trips/${tripId}/stats`)
      .set("Authorization", `Bearer ${token}`);
    expect(Array.isArray(res.body.data.topStops)).toBe(true);
    expect(typeof res.body.data.totalSpent).toBe("number");
  });

  it("unknown tripId returns 404 or error — not a 500 crash", async () => {
    const res = await request(app)
      .get("/api/trips/000000000000000000000000/stats")
      .set("Authorization", `Bearer ${token}`);
    expect([404, 400]).toContain(res.status);
  });
});
