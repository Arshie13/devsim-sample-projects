import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { createApp } from "../../../../server/src/app.js";
import { Recipe } from "../../../../server/src/models/Recipe.js";
import { Save } from "../../../../server/src/models/Save.js";
import { createTestUser } from "../../testUtils.js";

const app = createApp();

let token1: string;
let user1Id: any;
let token2: string;
let recipeId: string;

beforeEach(async () => {
  const a = await createTestUser({ username: "alice" });
  const b = await createTestUser({ username: "bob" });
  token1 = a.token;
  user1Id = a.user._id;
  token2 = b.token;

  const recipe = await Recipe.create({
    title: "Test Recipe",
    slug: `test-${Math.random().toString(36).slice(2, 6)}`,
    authorId: a.user._id,
    ingredients: [{ name: "x", qty: "1", unit: "" }],
    steps: [{ order: 0, text: "do" }],
    tags: [],
    savedCount: 0,
  });
  recipeId = String(recipe._id);
});

describe("Level 4 — Task 1: save recipe API", () => {
  it("first save returns 2xx and increments savedCount by 1", async () => {
    const res = await request(app)
      .post(`/api/recipes/${recipeId}/save`)
      .set("Authorization", `Bearer ${token1}`);
    expect([200, 201]).toContain(res.status);
    expect(res.body.success).toBe(true);

    const recipe = await Recipe.findById(recipeId);
    expect(recipe?.savedCount).toBe(1);
  });

  it("a duplicate save by the same user does NOT increment savedCount", async () => {
    await request(app).post(`/api/recipes/${recipeId}/save`).set("Authorization", `Bearer ${token1}`);
    const res = await request(app)
      .post(`/api/recipes/${recipeId}/save`)
      .set("Authorization", `Bearer ${token1}`);
    expect(res.status).toBeGreaterThanOrEqual(200);
    expect(res.status).toBeLessThan(300);

    const recipe = await Recipe.findById(recipeId);
    expect(recipe?.savedCount).toBe(1);

    const saves = await Save.find({ userId: user1Id, recipeId });
    expect(saves.length).toBeGreaterThanOrEqual(1);
  });

  it("a save by a different user increments savedCount by 1", async () => {
    await request(app).post(`/api/recipes/${recipeId}/save`).set("Authorization", `Bearer ${token1}`);
    await request(app).post(`/api/recipes/${recipeId}/save`).set("Authorization", `Bearer ${token2}`);

    const recipe = await Recipe.findById(recipeId);
    expect(recipe?.savedCount).toBe(2);
  });

  it("rejects unauthenticated requests with 401", async () => {
    const res = await request(app).post(`/api/recipes/${recipeId}/save`);
    expect(res.status).toBe(401);
  });

  it("returns 4xx for a non-existent recipe id", async () => {
    const fakeId = "0123456789abcdef01234567";
    const res = await request(app)
      .post(`/api/recipes/${fakeId}/save`)
      .set("Authorization", `Bearer ${token1}`);
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.status).toBeLessThan(500);
  });
});
