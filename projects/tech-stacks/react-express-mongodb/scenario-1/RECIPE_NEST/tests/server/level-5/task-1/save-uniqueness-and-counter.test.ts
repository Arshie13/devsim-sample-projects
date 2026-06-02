import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { createApp } from "../../../../server/src/app.js";
import { Recipe } from "../../../../server/src/models/Recipe.js";
import { Save } from "../../../../server/src/models/Save.js";
import { createTestUser } from "../../testUtils.js";

const app = createApp();

let token: string;
let userId: any;
let recipeId: string;

beforeEach(async () => {
  const a = await createTestUser({ username: "alice" });
  token = a.token;
  userId = a.user._id;
  // Ensure indexes are built so the compound unique index, if added, is enforced.
  await Save.syncIndexes();
  const recipe = await Recipe.create({
    title: "Hot Recipe",
    slug: `hot-${Math.random().toString(36).slice(2, 6)}`,
    authorId: a.user._id,
    ingredients: [{ name: "x", qty: "1", unit: "" }],
    steps: [{ order: 0, text: "do" }],
    tags: [],
    savedCount: 0,
  });
  recipeId = String(recipe._id);
});

describe("Level 5 — Task 1: duplicate-save & counter drift", () => {
  it("Save collection has a compound unique index on { userId, recipeId }", async () => {
    const indexes = await Save.collection.indexes();
    const compound = indexes.find(
      (idx: any) =>
        idx.key &&
        Object.keys(idx.key).includes("userId") &&
        Object.keys(idx.key).includes("recipeId") &&
        idx.unique === true,
    );
    expect(
      compound,
      "Add `SaveSchema.index({ userId: 1, recipeId: 1 }, { unique: true })` on the Save model",
    ).toBeTruthy();
  });

  it("100 concurrent save calls for the same (user, recipe) produce exactly 1 Save document", async () => {
    const requests = Array.from({ length: 100 }, () =>
      request(app).post(`/api/recipes/${recipeId}/save`).set("Authorization", `Bearer ${token}`),
    );
    await Promise.all(requests);

    const saves = await Save.countDocuments({ userId, recipeId });
    expect(saves).toBe(1);
  });

  it("after the same race, recipe.savedCount === 1 (no drift)", async () => {
    const requests = Array.from({ length: 100 }, () =>
      request(app).post(`/api/recipes/${recipeId}/save`).set("Authorization", `Bearer ${token}`),
    );
    await Promise.all(requests);

    const recipe = await Recipe.findById(recipeId);
    expect(recipe?.savedCount).toBe(1);
  });

  it("getSaved returns each recipe at most once per user", async () => {
    // Drive a few save attempts in parallel
    await Promise.all(
      Array.from({ length: 10 }, () =>
        request(app).post(`/api/recipes/${recipeId}/save`).set("Authorization", `Bearer ${token}`),
      ),
    );
    const res = await request(app).get("/api/recipes/saved").set("Authorization", `Bearer ${token}`);
    const ids = (res.body.data as any[]).map((r) => String(r._id ?? r?.recipeId?._id ?? r?.recipeId));
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });
});
