import { describe, it, expect, beforeEach } from "vitest";
import * as request from "supertest";
import { getApp, getPrisma } from "../../setup";
import { createTestUser, signInToken, createTestAccount, createTestCategory } from "../../testUtils";

describe("Level 3 / Task 2 — Budget-vs-Actual Tracking", () => {
  let token: string;
  let userId: string;
  let accountId: string;
  let categoryId: string;

  beforeEach(async () => {
    const prisma = getPrisma();
    const user = await createTestUser();
    userId = user.id;
    token = await signInToken(user.email);
    const account = await createTestAccount(user.id, { balance: 10000 });
    accountId = account.id;
    const category = await createTestCategory(user.id, { type: "EXPENSE", name: "Food" });
    categoryId = category.id;

    // Create a budget of 500 for January 2025
    await prisma.budget.create({
      data: { amount: 500, month: 1, year: 2025, categoryId, userId },
    });

    // Seed two expense transactions in January 2025 totalling 300
    await prisma.transaction.createMany({
      data: [
        { amount: 200, type: "EXPENSE", date: new Date("2025-01-10"), accountId, categoryId, userId },
        { amount: 100, type: "EXPENSE", date: new Date("2025-01-20"), accountId, categoryId, userId },
      ],
    });
  });

  it("GET /api/budgets returns spent, remaining, percentUsed, exceeded", async () => {
    const res = await request(getApp().getHttpServer())
      .get("/api/budgets?month=1&year=2025")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    const budgets = res.body.data ?? res.body;
    expect(budgets.length).toBeGreaterThanOrEqual(1);

    const food = budgets.find((b: any) => b.category?.name === "Food" || b.categoryId === categoryId);
    expect(food).toBeDefined();
    expect(Number(food.spent)).toBe(300);
    expect(Number(food.remaining)).toBe(200);
    expect(Number(food.percentUsed)).toBeCloseTo(60, 0);
    expect(food.exceeded).toBe(false);
  });

  it("flags exceeded=true when spent exceeds budget", async () => {
    const prisma = getPrisma();
    // Add another 300 to push total to 600, exceeding budget of 500
    await prisma.transaction.create({
      data: { amount: 300, type: "EXPENSE", date: new Date("2025-01-25"), accountId, categoryId, userId },
    });

    const res = await request(getApp().getHttpServer())
      .get("/api/budgets?month=1&year=2025")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    const budgets = res.body.data ?? res.body;
    const food = budgets.find((b: any) => b.category?.name === "Food" || b.categoryId === categoryId);
    expect(food.exceeded).toBe(true);
  });
});
