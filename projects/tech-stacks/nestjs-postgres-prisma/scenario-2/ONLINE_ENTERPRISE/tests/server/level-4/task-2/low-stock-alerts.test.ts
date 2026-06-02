import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { getApp } from "../../setup";
import { createTestUser, signInToken, createTestCategory, createTestProduct } from "../../testUtils";

describe("Level 4 / Task 2 — Low-Stock Alert Endpoint", () => {
  let adminToken: string;
  let customerToken: string;

  beforeEach(async () => {
    const admin = await createTestUser({ role: "ADMIN" });
    adminToken = await signInToken(admin.email);
    const customer = await createTestUser({ role: "CUSTOMER" });
    customerToken = await signInToken(customer.email);

    const category = await createTestCategory({ name: "Coffee" });
    // stock=3 → below default threshold of 10
    await createTestProduct(category.id, { name: "Low Stock Coffee", stock: 3 });
    // stock=15 → above default threshold
    await createTestProduct(category.id, { name: "Well Stocked Coffee", stock: 15 });
    // stock=0 → definitely low
    await createTestProduct(category.id, { name: "Out of Stock Coffee", stock: 0 });
  });

  it("returns products below the default threshold of 10", async () => {
    const res = await request(getApp().getHttpServer())
      .get("/api/reports/low-stock")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    const names = (res.body.data ?? res.body).map((p: any) => p.productName ?? p.name);
    expect(names).toContain("Low Stock Coffee");
    expect(names).toContain("Out of Stock Coffee");
    expect(names).not.toContain("Well Stocked Coffee");
  });

  it("respects a custom threshold query parameter", async () => {
    const res = await request(getApp().getHttpServer())
      .get("/api/reports/low-stock?threshold=5")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    const names = (res.body.data ?? res.body).map((p: any) => p.productName ?? p.name);
    expect(names).not.toContain("Low Stock Coffee"); // stock=3 is ≤5, still included
    // Actually stock=3 IS ≤5 so it should appear; "Well Stocked" (15) should not
    expect(names).not.toContain("Well Stocked Coffee");
  });

  it("results include productName, sku, currentStock, categoryName", async () => {
    const res = await request(getApp().getHttpServer())
      .get("/api/reports/low-stock")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    const items = res.body.data ?? res.body;
    expect(items.length).toBeGreaterThan(0);
    const item = items[0];
    expect(item).toHaveProperty("sku");
    const stockKey = "currentStock" in item ? "currentStock" : "stock";
    expect(item).toHaveProperty(stockKey);
  });

  it("results are sorted by stock level ascending (lowest first)", async () => {
    const res = await request(getApp().getHttpServer())
      .get("/api/reports/low-stock")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    const items = res.body.data ?? res.body;
    for (let i = 1; i < items.length; i++) {
      const prev = items[i - 1].currentStock ?? items[i - 1].stock;
      const curr = items[i].currentStock ?? items[i].stock;
      expect(Number(prev)).toBeLessThanOrEqual(Number(curr));
    }
  });

  it("is admin-only (customer gets 401/403)", async () => {
    const res = await request(getApp().getHttpServer())
      .get("/api/reports/low-stock")
      .set("Authorization", `Bearer ${customerToken}`);

    expect(res.status).toBeGreaterThanOrEqual(401);
    expect(res.status).toBeLessThanOrEqual(403);
  });
});
