import { describe, it, expect, beforeEach } from "vitest";
import * as request from "supertest";
import { getApp, getPrisma } from "../../setup";
import { createTestUser, signInToken, createTestAccount, createTestCategory } from "../../testUtils";

describe("Level 3 / Task 1 — Atomic Balance, Funds Guard & Field Validation", () => {
  let token: string;
  let userId: string;
  let accountId: string;
  let categoryId: string;

  beforeEach(async () => {
    const user = await createTestUser();
    userId = user.id;
    token = await signInToken(user.email);
    const account = await createTestAccount(user.id, { balance: 1000 });
    accountId = account.id;
    const category = await createTestCategory(user.id, { type: "EXPENSE" });
    categoryId = category.id;
  });

  it("EXPENSE decreases account balance atomically", async () => {
    await request(getApp().getHttpServer())
      .post("/api/transactions")
      .set("Authorization", `Bearer ${token}`)
      .send({ amount: 300, type: "EXPENSE", date: new Date().toISOString(), accountId, categoryId });

    const prisma = getPrisma();
    const account = await prisma.account.findUnique({ where: { id: accountId } });
    expect(Number(account!.balance)).toBe(700);
  });

  it("INCOME increases account balance atomically", async () => {
    const incomeCategory = await createTestCategory(userId, { type: "INCOME" });
    await request(getApp().getHttpServer())
      .post("/api/transactions")
      .set("Authorization", `Bearer ${token}`)
      .send({ amount: 500, type: "INCOME", date: new Date().toISOString(), accountId, categoryId: incomeCategory.id });

    const prisma = getPrisma();
    const account = await prisma.account.findUnique({ where: { id: accountId } });
    expect(Number(account!.balance)).toBe(1500);
  });

  it("rejects EXPENSE when balance is insufficient", async () => {
    const res = await request(getApp().getHttpServer())
      .post("/api/transactions")
      .set("Authorization", `Bearer ${token}`)
      .send({ amount: 2000, type: "EXPENSE", date: new Date().toISOString(), accountId, categoryId });

    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.status).toBeLessThan(500);
  });

  it("allows negative balance when allowNegativeBalance is true", async () => {
    const flexAccount = await createTestAccount(userId, { balance: 100, allowNegativeBalance: true });
    const res = await request(getApp().getHttpServer())
      .post("/api/transactions")
      .set("Authorization", `Bearer ${token}`)
      .send({ amount: 500, type: "EXPENSE", date: new Date().toISOString(), accountId: flexAccount.id, categoryId });

    expect(res.status).toBe(201);
  });

  it("rejects transaction with negative amount", async () => {
    const res = await request(getApp().getHttpServer())
      .post("/api/transactions")
      .set("Authorization", `Bearer ${token}`)
      .send({ amount: -50, type: "EXPENSE", date: new Date().toISOString(), accountId, categoryId });

    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  it("rejects transaction with a future date", async () => {
    const future = new Date(Date.now() + 86400_000).toISOString();
    const res = await request(getApp().getHttpServer())
      .post("/api/transactions")
      .set("Authorization", `Bearer ${token}`)
      .send({ amount: 100, type: "EXPENSE", date: future, accountId, categoryId });

    expect(res.status).toBeGreaterThanOrEqual(400);
  });
});
