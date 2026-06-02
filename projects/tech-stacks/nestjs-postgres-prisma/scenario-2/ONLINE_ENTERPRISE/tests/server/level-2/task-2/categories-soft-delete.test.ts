import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { getApp } from "../../setup";
import { createTestCategory, createTestProduct } from "../../testUtils";

describe("Level 2 / Task 2 — Soft-Deleted Categories Visibility", () => {
  let activeCatId: string;
  let inactiveCatId: string;

  beforeEach(async () => {
    const active = await createTestCategory({ name: "Active Category", isActive: true });
    activeCatId = active.id;

    const inactive = await createTestCategory({ name: "Inactive Category", isActive: false });
    inactiveCatId = inactive.id;

    // Product under each category
    await createTestProduct(activeCatId, { name: "Active Product" });
    await createTestProduct(inactiveCatId, { name: "Inactive Product" });
  });

  it("inactive categories do not appear in GET /api/categories", async () => {
    const res = await request(getApp().getHttpServer()).get("/api/categories");

    expect(res.status).toBe(200);
    const ids = (res.body.data ?? res.body).map((c: any) => c.id);
    expect(ids).toContain(activeCatId);
    expect(ids).not.toContain(inactiveCatId);
  });

  it("products under an inactive category are excluded from public listing", async () => {
    const res = await request(getApp().getHttpServer()).get("/api/products");

    expect(res.status).toBe(200);
    const names = (res.body.data ?? res.body).map((p: any) => p.name);
    expect(names).toContain("Active Product");
    expect(names).not.toContain("Inactive Product");
  });

  it("active category products remain visible in public listing", async () => {
    const res = await request(getApp().getHttpServer()).get("/api/products");

    expect(res.status).toBe(200);
    const names = (res.body.data ?? res.body).map((p: any) => p.name);
    expect(names).toContain("Active Product");
  });
});
