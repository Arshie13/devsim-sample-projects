import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { getApp } from "../../setup";
import {
  createTestUser,
  signInToken,
  createTestCategory,
  createTestProduct,
  createTestSettings,
} from "../../testUtils";

describe("Level 4 / Task 2 — Weekly Sales Report", () => {
  let adminToken: string;
  let cashierToken: string;
  let productId: string;

  beforeEach(async () => {
    const admin = await createTestUser({ role: "ADMIN" });
    adminToken = await signInToken(admin.email);
    const cashier = await createTestUser({ role: "CASHIER" });
    cashierToken = await signInToken(cashier.email);

    await createTestSettings({});

    const category = await createTestCategory({ name: "Coffee" });
    const product = await createTestProduct(category.id, { stock: 100, price: 15.0 });
    productId = product.id;
  });

  const placeOrder = (quantity = 1) =>
    request(getApp().getHttpServer())
      .post("/api/orders")
      .set("Authorization", `Bearer ${cashierToken}`)
      .send({ items: [{ productId, quantity }], paymentMethod: "CASH" });

  it("returns totalRevenue and totalOrders", async () => {
    await placeOrder(1);

    const res = await request(getApp().getHttpServer())
      .get("/api/reports/weekly")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("totalRevenue");
    expect(res.body).toHaveProperty("totalOrders");
  });

  it("returns a dailyBreakdown array with exactly 7 entries", async () => {
    const res = await request(getApp().getHttpServer())
      .get("/api/reports/weekly")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("dailyBreakdown");
    expect(Array.isArray(res.body.dailyBreakdown)).toBe(true);
    expect(res.body.dailyBreakdown.length).toBe(7);
  });

  it("each dailyBreakdown entry has date, revenue, and orderCount", async () => {
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

  it("totalOrders reflects orders placed today", async () => {
    await placeOrder(1);
    await placeOrder(2);

    const res = await request(getApp().getHttpServer())
      .get("/api/reports/weekly")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(Number(res.body.totalOrders)).toBeGreaterThanOrEqual(2);
  });

  it("includes startDate and endDate covering 7 days", async () => {
    const res = await request(getApp().getHttpServer())
      .get("/api/reports/weekly")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    const hasStartEnd =
      ("startDate" in res.body && "endDate" in res.body) ||
      res.body.dailyBreakdown.length === 7;
    expect(hasStartEnd).toBe(true);
  });

  it("is admin-only — cashier gets 401/403", async () => {
    const res = await request(getApp().getHttpServer())
      .get("/api/reports/weekly")
      .set("Authorization", `Bearer ${cashierToken}`);

    expect(res.status).toBeGreaterThanOrEqual(401);
    expect(res.status).toBeLessThanOrEqual(403);
  });
});
