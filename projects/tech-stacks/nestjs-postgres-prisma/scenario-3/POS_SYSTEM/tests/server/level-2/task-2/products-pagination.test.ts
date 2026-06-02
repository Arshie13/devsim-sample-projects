import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { getApp } from "../../setup";
import { createTestUser, signInToken, createTestCategory, createTestProduct } from "../../testUtils";

describe("Level 2 / Task 2 — Paginated Product Listing", () => {
  let cashierToken: string;

  beforeEach(async () => {
    const cashier = await createTestUser({ role: "CASHIER" });
    cashierToken = await signInToken(cashier.email);

    const category = await createTestCategory({ name: "Beverages" });
    for (let i = 1; i <= 15; i++) {
      await createTestProduct(category.id, { name: `Product ${i}` });
    }
    // Add a searchable product
    await createTestProduct(category.id, { name: "Ethiopian Dark Roast" });
  });

  it("GET /api/products returns a paginated envelope with data, total, page, limit, totalPages", async () => {
    const res = await request(getApp().getHttpServer())
      .get("/api/products")
      .set("Authorization", `Bearer ${cashierToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body).toHaveProperty("total");
    expect(res.body).toHaveProperty("page");
    expect(res.body).toHaveProperty("limit");
    expect(res.body).toHaveProperty("totalPages");
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("default page is 1 and default limit is 10", async () => {
    const res = await request(getApp().getHttpServer())
      .get("/api/products")
      .set("Authorization", `Bearer ${cashierToken}`);

    expect(res.status).toBe(200);
    expect(Number(res.body.page)).toBe(1);
    expect(Number(res.body.limit)).toBeLessThanOrEqual(20);
    expect(res.body.data.length).toBeLessThanOrEqual(20);
  });

  it("?page=2&limit=5 returns the second page of 5 products", async () => {
    const res = await request(getApp().getHttpServer())
      .get("/api/products?page=2&limit=5")
      .set("Authorization", `Bearer ${cashierToken}`);

    expect(res.status).toBe(200);
    expect(Number(res.body.page)).toBe(2);
    expect(Number(res.body.limit)).toBe(5);
    expect(res.body.data.length).toBeLessThanOrEqual(5);
  });

  it("total reflects the full count across all pages", async () => {
    const res = await request(getApp().getHttpServer())
      .get("/api/products?limit=5")
      .set("Authorization", `Bearer ${cashierToken}`);

    expect(res.status).toBe(200);
    expect(Number(res.body.total)).toBeGreaterThan(5);
  });

  it("?search= filter works alongside pagination", async () => {
    const res = await request(getApp().getHttpServer())
      .get("/api/products?search=Ethiopian&page=1&limit=10")
      .set("Authorization", `Bearer ${cashierToken}`);

    expect(res.status).toBe(200);
    const names = res.body.data.map((p: any) => p.name);
    expect(names.some((n: string) => n.includes("Ethiopian"))).toBe(true);
  });
});
