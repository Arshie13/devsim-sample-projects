import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { getApp } from "../../setup";
import { createTestCategory, createTestProduct } from "../../testUtils";

describe("Level 2 / Task 1 — Paginated & Category-Filterable Products", () => {
  let catAId: string;
  let catBId: string;

  beforeEach(async () => {
    const catA = await createTestCategory({ name: "Coffee Beans" });
    catAId = catA.id;
    const catB = await createTestCategory({ name: "Equipment" });
    catBId = catB.id;

    // Seed 8 products in catA, 5 in catB = 13 total
    for (let i = 0; i < 8; i++) {
      await createTestProduct(catAId, { name: `Bean ${i}` });
    }
    for (let i = 0; i < 5; i++) {
      await createTestProduct(catBId, { name: `Equipment ${i}` });
    }
  });

  it("returns paginated response with correct shape", async () => {
    const res = await request(getApp().getHttpServer()).get("/api/products?page=1&limit=5");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body).toHaveProperty("total");
    expect(res.body).toHaveProperty("page");
    expect(res.body).toHaveProperty("limit");
    expect(res.body).toHaveProperty("totalPages");
    expect(res.body.data).toHaveLength(5);
    expect(res.body.total).toBe(13);
  });

  it("defaults to page=1, limit=10", async () => {
    const res = await request(getApp().getHttpServer()).get("/api/products");

    expect(res.status).toBe(200);
    expect(res.body.page).toBe(1);
    expect(res.body.limit).toBe(10);
    expect(res.body.data).toHaveLength(10);
  });

  it("filters by categoryId", async () => {
    const res = await request(getApp().getHttpServer()).get(`/api/products?categoryId=${catBId}`);

    expect(res.status).toBe(200);
    expect(res.body.total).toBe(5);
    (res.body.data as any[]).forEach((p) => expect(p.categoryId).toBe(catBId));
  });

  it("filters by search term", async () => {
    const res = await request(getApp().getHttpServer()).get("/api/products?search=Equipment");

    expect(res.status).toBe(200);
    expect(res.body.total).toBe(5);
  });

  it("combines categoryId and search filters", async () => {
    const res = await request(getApp().getHttpServer())
      .get(`/api/products?categoryId=${catAId}&search=Bean 3`);

    expect(res.status).toBe(200);
    expect(res.body.total).toBeGreaterThanOrEqual(1);
    (res.body.data as any[]).forEach((p) => expect(p.categoryId).toBe(catAId));
  });
});
