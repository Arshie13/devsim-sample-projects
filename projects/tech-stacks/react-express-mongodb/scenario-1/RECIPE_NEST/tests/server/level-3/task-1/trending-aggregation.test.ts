import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { createApp } from "../../../../server/src/app.js";
import { Recipe } from "../../../../server/src/models/Recipe.js";
import { Save } from "../../../../server/src/models/Save.js";
import { User } from "../../../../server/src/models/User.js";
import { createTestUser } from "../../testUtils.js";

const app = createApp();

async function seedRecipe(opts: { title: string; daysAgo: number; saves: number; authorId: any }) {
  const createdAt = new Date(Date.now() - opts.daysAgo * 86400000);
  const recipe = await Recipe.create({
    title: opts.title,
    slug: `${opts.title.toLowerCase().replace(/\s+/g, "-")}-${Math.random().toString(36).slice(2, 6)}`,
    authorId: opts.authorId,
    ingredients: [{ name: "x", qty: "1", unit: "" }],
    steps: [{ order: 0, text: "do thing" }],
    tags: [],
    createdAt,
    updatedAt: createdAt,
  });
  for (let i = 0; i < opts.saves; i++) {
    const u = await User.create({
      name: `S${i}`,
      username: `s_${recipe._id}_${i}`,
      email: `s_${recipe._id}_${i}@x.com`,
      passwordHash: "x",
    });
    await Save.create({ userId: u._id, recipeId: recipe._id });
  }
  return recipe;
}

describe("Level 3 — Task 1: trending recipes aggregation", () => {
  let authorId: any;
  beforeEach(async () => {
    const { user } = await createTestUser({ username: "author" });
    authorId = user._id;
  });

  it("excludes recipes older than 7 days", async () => {
    await seedRecipe({ title: "Old", daysAgo: 30, saves: 100, authorId });
    await seedRecipe({ title: "Fresh", daysAgo: 1, saves: 1, authorId });

    const res = await request(app).get("/api/recipes/trending");
    const body = res.body?.data ?? res.body; // tolerate either shape
    const titles = (body as any[]).map((r) => r.title);
    expect(titles).not.toContain("Old");
    expect(titles).toContain("Fresh");
  });

  it("returns at most 10 documents", async () => {
    for (let i = 0; i < 12; i++) {
      await seedRecipe({ title: `R${i}`, daysAgo: 1, saves: i, authorId });
    }
    const res = await request(app).get("/api/recipes/trending");
    const body = res.body?.data ?? res.body;
    expect((body as any[]).length).toBeLessThanOrEqual(10);
  });

  it("sorts by savedCount descending", async () => {
    await seedRecipe({ title: "Low", daysAgo: 1, saves: 1, authorId });
    await seedRecipe({ title: "High", daysAgo: 1, saves: 5, authorId });
    await seedRecipe({ title: "Mid", daysAgo: 1, saves: 3, authorId });

    const res = await request(app).get("/api/recipes/trending");
    const body = res.body?.data ?? res.body;
    const titles = (body as any[]).map((r) => r.title);
    // High should appear before Mid which should appear before Low.
    expect(titles.indexOf("High")).toBeLessThan(titles.indexOf("Mid"));
    expect(titles.indexOf("Mid")).toBeLessThan(titles.indexOf("Low"));
  });

  it("breaks ties on savedCount by newer createdAt first", async () => {
    await seedRecipe({ title: "Older", daysAgo: 5, saves: 2, authorId });
    await seedRecipe({ title: "Newer", daysAgo: 1, saves: 2, authorId });

    const res = await request(app).get("/api/recipes/trending");
    const body = res.body?.data ?? res.body;
    const titles = (body as any[]).map((r) => r.title);
    expect(titles.indexOf("Newer")).toBeLessThan(titles.indexOf("Older"));
  });

  it("does not include the heavy `saves` array in the response", async () => {
    await seedRecipe({ title: "WithSaves", daysAgo: 1, saves: 3, authorId });
    const res = await request(app).get("/api/recipes/trending");
    const body = res.body?.data ?? res.body;
    for (const doc of body as any[]) {
      expect(doc.saves).toBeUndefined();
    }
  });

  it("returns an empty array when nothing is recent", async () => {
    await seedRecipe({ title: "Ancient", daysAgo: 90, saves: 50, authorId });
    const res = await request(app).get("/api/recipes/trending");
    const body = res.body?.data ?? res.body;
    expect((body as any[]).length).toBe(0);
  });
});
