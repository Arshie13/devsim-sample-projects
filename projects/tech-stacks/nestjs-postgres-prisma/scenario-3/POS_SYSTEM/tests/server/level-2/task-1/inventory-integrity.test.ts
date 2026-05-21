import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { getApp } from "../../setup";
import { createTestUser, signInToken, createTestCategory, createTestProduct } from "../../testUtils";

describe("Level 2 / Task 1 — Inventory Integrity Guards", () => {
  let adminToken: string;
  let atThresholdProductId: string;
  let wellStockedProductId: string;

  beforeEach(async () => {
    const admin = await createTestUser({ role: "ADMIN" });
    adminToken = await signInToken(admin.email);

    const category = await createTestCategory({ name: "Coffee" });

    // stock === lowStock threshold → should appear in low-stock list
    const atThreshold = await createTestProduct(category.id, {
      name: "At Threshold Coffee",
      stock: 10,
      lowStock: 10,
    });
    atThresholdProductId = atThreshold.id;

    // stock > lowStock threshold → should NOT appear in low-stock list
    const wellStocked = await createTestProduct(category.id, {
      name: "Well Stocked Coffee",
      stock: 50,
      lowStock: 10,
    });
    wellStockedProductId = wellStocked.id;
  });

  describe("Low-stock comparison fix (Bug #INV-001)", () => {
    it("GET /api/inventory/low-stock includes product at threshold (quantity === lowStock)", async () => {
      const res = await request(getApp().getHttpServer())
        .get("/api/inventory/low-stock")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      const items = res.body.data ?? res.body;
      const names = items.map((p: any) => p.name ?? p.productName);
      expect(names).toContain("At Threshold Coffee");
    });

    it("GET /api/inventory/low-stock excludes product above threshold", async () => {
      const res = await request(getApp().getHttpServer())
        .get("/api/inventory/low-stock")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      const items = res.body.data ?? res.body;
      const names = items.map((p: any) => p.name ?? p.productName);
      expect(names).not.toContain("Well Stocked Coffee");
    });
  });

  describe("Prevent negative inventory (Bug #INV-002)", () => {
    it("PUT /api/inventory/:productId with quantity: -1 returns 400", async () => {
      const res = await request(getApp().getHttpServer())
        .put(`/api/inventory/${atThresholdProductId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ quantity: -1 });

      expect(res.status).toBe(400);
    });

    it("PUT /api/inventory/:productId with quantity: 0 is accepted", async () => {
      const res = await request(getApp().getHttpServer())
        .put(`/api/inventory/${atThresholdProductId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ quantity: 0 });

      expect(res.status).toBeLessThan(400);
    });

    it("PUT /api/inventory/:productId with valid positive quantity succeeds", async () => {
      const res = await request(getApp().getHttpServer())
        .put(`/api/inventory/${wellStockedProductId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ quantity: 25 });

      expect(res.status).toBeLessThan(300);
    });
  });
});
