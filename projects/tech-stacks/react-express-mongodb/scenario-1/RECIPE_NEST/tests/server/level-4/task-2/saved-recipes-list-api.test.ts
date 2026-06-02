import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { createApp } from "../../../../server/src/app.js";
import { Recipe } from "../../../../server/src/models/Recipe.js";
import { Save } from "../../../../server/src/models/Save.js";
import { createTestUser } from "../../testUtils.js";

const app = createApp();

let token: string;
let userId: any;
let recipeAId: string;
let recipeBId: string;

beforeEach(async () => {
  const a = await createTestUser({ username: "alice" });
  token = a.token;
  userId = a.user._id;
  const recipeA = await Recipe.create({
    title: "Alpha",
    slug: `alpha-${Math.random().toString(36).slice(2, 6)}`,
    authorId: a.user._id,
    ingredients: [{ name: "x", qty: "1", unit: "" }],
    steps: [{ order: 0, text: "do" }],
    tags: [],
    savedCount: 0,
  });
  const recipeB = await Recipe.create({
    title: "Beta",
    slug: `beta-${Math.random().toString(36).slice(2, 6)}`,
    authorId: a.user._id,
    ingredients: [{ name: "x", qty: "1", unit: "" }],
    steps: [{ order: 0, text: "do" }],
    tags: [],
    savedCount: 0,
  });
  recipeAId = String(recipeA._id);
  recipeBId = String(recipeB._id);
});

describe("Level 4 — Task 2: saved recipes list + unsave API", () => {
  it("GET /api/recipes/saved returns 200 with the user's saved recipes", async () => {
    await request(app).post(`/api/recipes/${recipeAId}/save`).set("Authorization", `Bearer ${token}`);
    await request(app).post(`/api/recipes/${recipeBId}/save`).set("Authorization", `Bearer ${token}`);

    const res = await request(app).get("/api/recipes/saved").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(2);
  });

  it("GET /api/recipes/saved sorts by savedAt descending (newest first)", async () => {
    await request(app).post(`/api/recipes/${recipeAId}/save`).set("Authorization", `Bearer ${token}`);
    await new Promise((r) => setTimeout(r, 20));
    await request(app).post(`/api/recipes/${recipeBId}/save`).set("Authorization", `Bearer ${token}`);

    const res = await request(app).get("/api/recipes/saved").set("Authorization", `Bearer ${token}`);
    const titles = (res.body.data as any[]).map((r) => r.title ?? r?.recipeId?.title);
    expect(titles[0]).toBe("Beta");
    expect(titles[1]).toBe("Alpha");
  });

  it("DELETE /api/recipes/:id/save removes the Save and decrements savedCount", async () => {
    await request(app).post(`/api/recipes/${recipeAId}/save`).set("Authorization", `Bearer ${token}`);
    let recipe = await Recipe.findById(recipeAId);
    expect(recipe?.savedCount).toBe(1);

    const res = await request(app).delete(`/api/recipes/${recipeAId}/save`).set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);

    recipe = await Recipe.findById(recipeAId);
    expect(recipe?.savedCount).toBe(0);

    const saves = await Save.countDocuments({ userId, recipeId: recipeAId });
    expect(saves).toBe(0);
  });

  it("savedCount never goes below 0 even with extra unsaves", async () => {
    await request(app).delete(`/api/recipes/${recipeAId}/save`).set("Authorization", `Bearer ${token}`);
    const recipe = await Recipe.findById(recipeAId);
    expect(recipe?.savedCount).toBeGreaterThanOrEqual(0);
  });

  it("GET /api/recipes/saved is unauthenticated → 401", async () => {
    const res = await request(app).get("/api/recipes/saved");
    expect(res.status).toBe(401);
  });
});
