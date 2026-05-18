import { describe, it, expect, beforeEach } from "vitest";
import * as request from "supertest";
import { getApp } from "../../setup";
import { createTestUser, signInToken, createTestSettings } from "../../testUtils";

describe("Level 1 / Task 2 — Add phoneNumber to Store Settings", () => {
  let adminToken: string;

  beforeEach(async () => {
    const admin = await createTestUser({ role: "ADMIN" });
    adminToken = await signInToken(admin.email);
    await createTestSettings({});
  });

  it("GET /api/settings returns a response with settings data", async () => {
    const res = await request(getApp().getHttpServer())
      .get("/api/settings")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
  });

  it("GET /api/settings response includes phoneNumber field (may be null)", async () => {
    const res = await request(getApp().getHttpServer())
      .get("/api/settings")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect("phoneNumber" in res.body).toBe(true);
  });

  it("PUT /api/settings persists phoneNumber value", async () => {
    const phone = "+1-555-0199";

    const putRes = await request(getApp().getHttpServer())
      .put("/api/settings")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ phoneNumber: phone });

    expect(putRes.status).toBeLessThan(300);

    const getRes = await request(getApp().getHttpServer())
      .get("/api/settings")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(getRes.body.phoneNumber).toBe(phone);
  });

  it("phoneNumber field is optional — omitting it does not cause an error", async () => {
    const res = await request(getApp().getHttpServer())
      .put("/api/settings")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ storeName: "Test Store" });

    expect(res.status).toBeLessThan(300);
  });
});
