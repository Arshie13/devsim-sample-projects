import { describe, it, expect, beforeEach } from "vitest";
import * as request from "supertest";
import { getApp, getPrisma } from "../../setup";
import { createTestUser, signInToken, createTestCategory, createTestProduct } from "../../testUtils";

describe("Level 4 / Task 1 — Daily & Weekly Sales Reports", () => {
  let adminToken: string;
  let customerToken: string;
  let productId: string;

  beforeEach(async () => {
    const admin = await createTestUser({ role: "ADMIN" });
    adminToken = await signInToken(admin.email);
    const customer = await createTestUser({ role: "CUSTOMER" });
    customerToken = await signInToken(customer.email);

    const category = await createTestCategory({ name: "Coffee" });
    const product = await createTestProduct(category.id, { stock: 100, price: 20.00 });
    productId = product.id;
  });

  async function placeOrder(quantity = 1) {
    return request(getApp().getHttpServer())
      .post("/api/orders")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ items: [{ productId, quantity }], shippingAddress: "1 Test Ave", paymentMethod: "CARD" });
  }

  describe("Daily Report", () => {
    it("returns daily revenue and order count", async () => {
      await placeOrder(2);
      await placeOrder(1);

      const res = await request(getApp().getHttpServer())
        .get("/api/reports/daily")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("totalRevenue");
      expect(res.body).toHaveProperty("orderCount");
      expect(Number(res.body.orderCount)).toBe(2);
    });

    it("returns top 5 best-selling products", async () => {
      await placeOrder(3);

      const res = await request(getApp().getHttpServer())
        .get("/api/reports/daily")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("topProducts");
      expect(Array.isArray(res.body.topProducts)).toBe(true);
      expect(res.body.topProducts.length).toBeLessThanOrEqual(5);
    });

    it("is admin-only (customer gets 401/403)", async () => {
      const res = await request(getApp().getHttpServer())
        .get("/api/reports/daily")
        .set("Authorization", `Bearer ${customerToken}`);

      expect(res.status).toBeGreaterThanOrEqual(401);
      expect(res.status).toBeLessThanOrEqual(403);
    });
  });

  describe("Weekly Report", () => {
    it("returns weekly revenue and order count", async () => {
      await placeOrder(1);

      const res = await request(getApp().getHttpServer())
        .get("/api/reports/weekly")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("totalRevenue");
      expect(res.body).toHaveProperty("totalOrders");
    });

    it("returns a daily breakdown array for 7 days", async () => {
      const res = await request(getApp().getHttpServer())
        .get("/api/reports/weekly")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("dailyBreakdown");
      expect(Array.isArray(res.body.dailyBreakdown)).toBe(true);
      expect(res.body.dailyBreakdown.length).toBe(7);
    });

    it("daily breakdown entries each have date, revenue, orderCount", async () => {
      const res = await request(getApp().getHttpServer())
        .get("/api/reports/weekly")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      res.body.dailyBreakdown.forEach((entry: any) => {
        expect(entry).toHaveProperty("date");
        expect(entry).toHaveProperty("revenue");
        expect(entry).toHaveProperty("orderCount");
      });
    });
  });
});
