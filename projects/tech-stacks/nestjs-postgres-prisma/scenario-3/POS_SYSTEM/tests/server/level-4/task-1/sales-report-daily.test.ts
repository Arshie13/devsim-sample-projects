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

describe("Level 4 / Task 1 — Daily Sales Report", () => {
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
    const product = await createTestProduct(category.id, { stock: 100, price: 20.0 });
    productId = product.id;
  });

  const placeOrder = (quantity = 1) =>
    request(getApp().getHttpServer())
      .post("/api/orders")
      .set("Authorization", `Bearer ${cashierToken}`)
      .send({ items: [{ productId, quantity }], paymentMethod: "CARD" });

  it("returns totalRevenue and orderCount", async () => {
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

  it("totalRevenue reflects the sum of all today's order totals", async () => {
    await placeOrder(1);

    const res = await request(getApp().getHttpServer())
      .get("/api/reports/daily")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(Number(res.body.totalRevenue)).toBeGreaterThan(0);
  });

  it("returns topProducts array with at most 5 entries", async () => {
    await placeOrder(3);

    const res = await request(getApp().getHttpServer())
      .get("/api/reports/daily")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("topProducts");
    expect(Array.isArray(res.body.topProducts)).toBe(true);
    expect(res.body.topProducts.length).toBeLessThanOrEqual(5);
  });

  it("topProducts entries include productName/name and quantitySold", async () => {
    await placeOrder(1);

    const res = await request(getApp().getHttpServer())
      .get("/api/reports/daily")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    if (res.body.topProducts.length > 0) {
      const entry = res.body.topProducts[0];
      const hasName = "productName" in entry || "name" in entry;
      const hasQty = "quantitySold" in entry || "quantity" in entry;
      expect(hasName).toBe(true);
      expect(hasQty).toBe(true);
    }
  });

  it("is admin-only — cashier gets 401/403", async () => {
    const res = await request(getApp().getHttpServer())
      .get("/api/reports/daily")
      .set("Authorization", `Bearer ${cashierToken}`);

    expect(res.status).toBeGreaterThanOrEqual(401);
    expect(res.status).toBeLessThanOrEqual(403);
  });
});
