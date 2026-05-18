import { describe, it, expect, beforeEach } from "vitest";
import * as request from "supertest";
import { getApp, getPrisma } from "../../setup";
import { createTestUser, signInToken, createTestAccount, createTestCategory } from "../../testUtils";

describe("Level 4 / Task 1 — Monthly Summary & Trend Reports", () => {
  let adminToken: string;
  let userId: string;
  let accountId: string;
  let expenseCategoryId: string;
  let incomeCategoryId: string;

  beforeEach(async () => {
    const prisma = getPrisma();
    const admin = await createTestUser({ role: "ADMIN" });
    userId = admin.id;
    adminToken = await signInToken(admin.email);
    const account = await createTestAccount(admin.id, { balance: 50000 });
    accountId = account.id;
    const expenseCat = await createTestCategory(admin.id, { type: "EXPENSE" });
    expenseCategoryId = expenseCat.id;
    const incomeCat = await createTestCategory(admin.id, { type: "INCOME" });
    incomeCategoryId = incomeCat.id;

    // Seed Jan 2025: 3 expense (total 600) + 1 income (2000)
    await prisma.transaction.createMany({
      data: [
        { amount: 200, type: "EXPENSE", date: new Date("2025-01-05"), accountId, categoryId: expenseCategoryId, userId },
        { amount: 200, type: "EXPENSE", date: new Date("2025-01-15"), accountId, categoryId: expenseCategoryId, userId },
        { amount: 200, type: "EXPENSE", date: new Date("2025-01-25"), accountId, categoryId: expenseCategoryId, userId },
        { amount: 2000, type: "INCOME", date: new Date("2025-01-01"), accountId, categoryId: incomeCategoryId, userId },
      ],
    });
  });

  describe("Monthly Summary", () => {
    it("returns correct income, expense, and net savings", async () => {
      const res = await request(getApp().getHttpServer())
        .get("/api/reports/monthly-summary?month=1&year=2025")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(Number(res.body.totalIncome)).toBe(2000);
      expect(Number(res.body.totalExpense)).toBe(600);
      expect(Number(res.body.netSavings)).toBe(1400);
    });

    it("returns transactionCount", async () => {
      const res = await request(getApp().getHttpServer())
        .get("/api/reports/monthly-summary?month=1&year=2025")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.transactionCount ?? res.body.numberOfTransactions).toBe(4);
    });
  });

  describe("Trend Report", () => {
    it("returns an array of monthly entries sorted chronologically", async () => {
      const res = await request(getApp().getHttpServer())
        .get("/api/reports/trends?months=3")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeLessThanOrEqual(3);

      // Verify chronological order
      const months = res.body.map((e: any) => e.year * 100 + e.month);
      for (let i = 1; i < months.length; i++) {
        expect(months[i]).toBeGreaterThanOrEqual(months[i - 1]);
      }
    });

    it("each entry has totalIncome, totalExpense, netSavings", async () => {
      const res = await request(getApp().getHttpServer())
        .get("/api/reports/trends?months=6")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      res.body.forEach((entry: any) => {
        expect(entry).toHaveProperty("month");
        expect(entry).toHaveProperty("year");
        expect(entry).toHaveProperty("totalIncome");
        expect(entry).toHaveProperty("totalExpense");
        expect(entry).toHaveProperty("netSavings");
      });
    });
  });
});
