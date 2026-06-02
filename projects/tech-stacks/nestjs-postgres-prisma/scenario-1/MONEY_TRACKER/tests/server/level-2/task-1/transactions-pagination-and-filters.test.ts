import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { getApp, getPrisma } from "../../setup";
import { createTestUser, signInToken, createTestAccount, createTestCategory } from "../../testUtils";

describe("Level 2 / Task 1 — Paginated & Filterable Transactions", () => {
  let token: string;
  let accountId: string;
  let expenseCategoryId: string;
  let incomeCategoryId: string;

  beforeEach(async () => {
    const prisma = getPrisma();
    const user = await createTestUser();
    token = await signInToken(user.email);
    const account = await createTestAccount(user.id, { balance: 100000 });
    accountId = account.id;
    const expenseCat = await createTestCategory(user.id, { type: "EXPENSE" });
    expenseCategoryId = expenseCat.id;
    const incomeCat = await createTestCategory(user.id, { type: "INCOME" });
    incomeCategoryId = incomeCat.id;

    // Seed 15 expense + 5 income transactions
    const txData = Array.from({ length: 20 }, (_, i) => ({
      amount: 100 + i,
      type: i < 15 ? "EXPENSE" : "INCOME",
      date: new Date(2025, 0, i + 1).toISOString(),
      accountId: account.id,
      categoryId: i < 15 ? expenseCat.id : incomeCat.id,
      userId: user.id,
    }));
    await prisma.transaction.createMany({ data: txData as any });
  });

  it("returns paginated response with correct shape", async () => {
    const res = await request(getApp().getHttpServer())
      .get("/api/transactions?page=1&limit=5")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body).toHaveProperty("total");
    expect(res.body).toHaveProperty("page");
    expect(res.body).toHaveProperty("limit");
    expect(res.body).toHaveProperty("totalPages");
    expect(res.body.data).toHaveLength(5);
    expect(res.body.total).toBe(20);
  });

  it("defaults to page=1, limit=20", async () => {
    const res = await request(getApp().getHttpServer())
      .get("/api/transactions")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.page).toBe(1);
    expect(res.body.limit).toBe(20);
    expect(res.body.data).toHaveLength(20);
  });

  it("filters by type=EXPENSE", async () => {
    const res = await request(getApp().getHttpServer())
      .get("/api/transactions?type=EXPENSE")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.total).toBe(15);
    res.body.data.forEach((t: any) => expect(t.type).toBe("EXPENSE"));
  });

  it("filters by categoryId", async () => {
    const res = await request(getApp().getHttpServer())
      .get(`/api/transactions?categoryId=${incomeCategoryId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.total).toBe(5);
  });

  it("filters by date range", async () => {
    const res = await request(getApp().getHttpServer())
      .get("/api/transactions?startDate=2025-01-05&endDate=2025-01-10")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.total).toBeGreaterThanOrEqual(1);
    expect(res.body.total).toBeLessThanOrEqual(6);
  });
});
