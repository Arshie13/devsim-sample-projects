import { describe, it, expect, beforeEach } from "vitest";
import * as request from "supertest";
import { getApp, getPrisma } from "../../setup";
import { createTestUser, signInToken, createTestAccount, createTestCategory } from "../../testUtils";

describe("Level 5 / Task 1 — Balance Drift, Timezone & Budget Math Fixes", () => {
  let token: string;
  let adminToken: string;
  let userId: string;
  let accountId: string;
  let categoryId: string;

  beforeEach(async () => {
    const user = await createTestUser();
    userId = user.id;
    token = await signInToken(user.email);
    const admin = await createTestUser({ role: "ADMIN" });
    adminToken = await signInToken(admin.email);
    const account = await createTestAccount(user.id, { balance: 10000 });
    accountId = account.id;
    const category = await createTestCategory(user.id, { type: "EXPENSE" });
    categoryId = category.id;
  });

  describe("Balance drift — pessimistic locking", () => {
    it("balance stays consistent after sequential create-delete cycle", async () => {
      const prisma = getPrisma();

      // Create then delete a transaction; balance should be restored
      const createRes = await request(getApp().getHttpServer())
        .post("/api/transactions")
        .set("Authorization", `Bearer ${token}`)
        .send({ amount: 500, type: "EXPENSE", date: new Date().toISOString(), accountId, categoryId });
      expect(createRes.status).toBe(201);

      const txId = createRes.body.id;
      await request(getApp().getHttpServer())
        .delete(`/api/transactions/${txId}`)
        .set("Authorization", `Bearer ${token}`);

      const account = await prisma.account.findUnique({ where: { id: accountId } });
      expect(Number(account!.balance)).toBe(10000);
    });
  });

  describe("Budget math — division-by-zero guard", () => {
    it("returns percentUsed=0 and no NaN/Infinity when budgetAmount is zero", async () => {
      const prisma = getPrisma();
      await prisma.budget.create({
        data: { amount: 0, month: 1, year: 2025, categoryId, userId },
      });

      const res = await request(getApp().getHttpServer())
        .get("/api/budgets?month=1&year=2025")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      const budgets = res.body.data ?? res.body;
      const budget = budgets.find((b: any) => b.categoryId === categoryId);
      expect(budget).toBeDefined();
      const pct = budget.percentUsed;
      expect(pct).not.toBeNaN();
      expect(isFinite(pct)).toBe(true);
      expect(Number(pct)).toBe(0);
    });
  });

  describe("Report timezone consistency", () => {
    it("monthly summary returns consistent totals on repeated calls", async () => {
      const prisma = getPrisma();
      await prisma.transaction.create({
        data: { amount: 100, type: "EXPENSE", date: new Date("2025-01-15"), accountId, categoryId, userId },
      });

      const call1 = await request(getApp().getHttpServer())
        .get("/api/reports/monthly-summary?month=1&year=2025")
        .set("Authorization", `Bearer ${adminToken}`);
      const call2 = await request(getApp().getHttpServer())
        .get("/api/reports/monthly-summary?month=1&year=2025")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(call1.status).toBe(200);
      expect(call2.status).toBe(200);
      expect(call1.body.totalExpense).toEqual(call2.body.totalExpense);
    });
  });
});
