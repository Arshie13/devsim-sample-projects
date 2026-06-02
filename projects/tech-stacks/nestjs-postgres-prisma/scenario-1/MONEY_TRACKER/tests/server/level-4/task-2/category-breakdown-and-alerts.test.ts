import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { getApp, getPrisma } from "../../setup";
import { createTestUser, signInToken, createTestAccount, createTestCategory } from "../../testUtils";

describe("Level 4 / Task 2 — Category Breakdown & Budget Alerts", () => {
  let adminToken: string;
  let userId: string;
  let accountId: string;
  let foodCategoryId: string;
  let transportCategoryId: string;

  beforeEach(async () => {
    const prisma = getPrisma();
    const admin = await createTestUser({ role: "ADMIN" });
    userId = admin.id;
    adminToken = await signInToken(admin.email);
    const account = await createTestAccount(admin.id, { balance: 50000 });
    accountId = account.id;

    const food = await createTestCategory(admin.id, { name: "Food", type: "EXPENSE" });
    foodCategoryId = food.id;
    const transport = await createTestCategory(admin.id, { name: "Transport", type: "EXPENSE" });
    transportCategoryId = transport.id;

    // Seed Jan 2025 expenses: Food 600, Transport 200
    await prisma.transaction.createMany({
      data: [
        { amount: 400, type: "EXPENSE", date: new Date("2025-01-10"), accountId, categoryId: foodCategoryId, userId },
        { amount: 200, type: "EXPENSE", date: new Date("2025-01-15"), accountId, categoryId: foodCategoryId, userId },
        { amount: 200, type: "EXPENSE", date: new Date("2025-01-20"), accountId, categoryId: transportCategoryId, userId },
      ],
    });

    // Budget for Food: 700 (86% used → alert), Transport: 500 (40% used → no alert)
    await prisma.budget.createMany({
      data: [
        { amount: 700, month: 1, year: 2025, categoryId: foodCategoryId, userId },
        { amount: 500, month: 1, year: 2025, categoryId: transportCategoryId, userId },
      ],
    });
  });

  describe("Category Breakdown", () => {
    it("returns entries sorted by total descending", async () => {
      const res = await request(getApp().getHttpServer())
        .get("/api/reports/category-breakdown?month=1&year=2025&type=EXPENSE")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(2);

      // Food (600) should come before Transport (200)
      expect(Number(res.body[0].total)).toBeGreaterThanOrEqual(Number(res.body[1].total));
    });

    it("each entry has categoryName, total, percentage, transactionCount", async () => {
      const res = await request(getApp().getHttpServer())
        .get("/api/reports/category-breakdown?month=1&year=2025")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      res.body.forEach((entry: any) => {
        expect(entry).toHaveProperty("categoryName");
        expect(entry).toHaveProperty("total");
        expect(entry).toHaveProperty("percentage");
        expect(entry).toHaveProperty("transactionCount");
      });
    });
  });

  describe("Budget Alerts", () => {
    it("only returns budgets at or above 80% used", async () => {
      const res = await request(getApp().getHttpServer())
        .get("/api/reports/budget-alerts")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      // Food is at 600/700 ≈ 86% → should appear
      const names = (res.body.data ?? res.body).map((b: any) => b.categoryName ?? b.category?.name);
      expect(names).toContain("Food");
      // Transport is at 200/500 = 40% → should NOT appear
      expect(names).not.toContain("Transport");
    });

    it("alerts are sorted by percentUsed descending", async () => {
      const res = await request(getApp().getHttpServer())
        .get("/api/reports/budget-alerts")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      const alerts = res.body.data ?? res.body;
      for (let i = 1; i < alerts.length; i++) {
        expect(Number(alerts[i - 1].percentUsed)).toBeGreaterThanOrEqual(Number(alerts[i].percentUsed));
      }
    });
  });
});
