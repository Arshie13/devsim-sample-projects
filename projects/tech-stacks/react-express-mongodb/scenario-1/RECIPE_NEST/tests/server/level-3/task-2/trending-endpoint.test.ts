import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { createApp } from "../../../../server/src/app.js";
import { Recipe } from "../../../../server/src/models/Recipe.js";
import { createTestUser } from "../../testUtils.js";

const app = createApp();

async function seedRecipes(authorId: any, n: number) {
  for (let i = 0; i < n; i++) {
    await Recipe.create({
      title: `R${i}`,
      slug: `r-${i}-${Math.random().toString(36).slice(2, 6)}`,
      authorId,
      ingredients: [{ name: "x", qty: "1", unit: "" }],
      steps: [{ order: 0, text: "do" }],
      tags: [],
      createdAt: new Date(Date.now() - 86400000),
      updatedAt: new Date(),
    });
  }
}

describe("Level 3 — Task 2: trending endpoint contract", () => {
  it("returns 200 and { success: true, data: [...] }", async () => {
    const { user } = await createTestUser();
    await seedRecipes(user._id, 3);
    const res = await request(app).get("/api/recipes/trending");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("respects ?limit and returns at most that many docs", async () => {
    const { user } = await createTestUser();
    await seedRecipes(user._id, 8);
    const res = await request(app).get("/api/recipes/trending?limit=3");
    expect(res.status).toBe(200);
    expect((res.body.data as any[]).length).toBeLessThanOrEqual(3);
  });

  it("rejects ?limit=999 with 400 (validation error)", async () => {
    const res = await request(app).get("/api/recipes/trending?limit=999");
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("rejects ?limit=0 with 400", async () => {
    const res = await request(app).get("/api/recipes/trending?limit=0");
    expect(res.status).toBe(400);
  });

  it("rejects ?limit=abc with 400", async () => {
    const res = await request(app).get("/api/recipes/trending?limit=abc");
    expect(res.status).toBe(400);
  });
});
