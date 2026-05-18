import { describe, it, expect, beforeEach } from "vitest";
import * as request from "supertest";
import { getApp } from "../../setup";
import { createTestUser, signInToken, createTestAccount, createTestCategory } from "../../testUtils";

describe("Level 2 / Task 2 — Soft-Deleted Categories Visibility", () => {
  let token: string;
  let accountId: string;
  let activeCategoryId: string;
  let inactiveCategoryId: string;

  beforeEach(async () => {
    const user = await createTestUser();
    token = await signInToken(user.email);
    const account = await createTestAccount(user.id, { balance: 5000 });
    accountId = account.id;

    const active = await createTestCategory(user.id, { name: "Active Cat", isActive: true });
    activeCategoryId = active.id;

    const inactive = await createTestCategory(user.id, { name: "Inactive Cat", isActive: false });
    inactiveCategoryId = inactive.id;
  });

  it("inactive categories do not appear in GET /api/categories", async () => {
    const res = await request(getApp().getHttpServer())
      .get("/api/categories")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    const ids = (res.body.data ?? res.body).map((c: any) => c.id);
    expect(ids).toContain(activeCategoryId);
    expect(ids).not.toContain(inactiveCategoryId);
  });

  it("creating a transaction with an inactive categoryId is rejected", async () => {
    const res = await request(getApp().getHttpServer())
      .post("/api/transactions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        amount: 100,
        type: "EXPENSE",
        date: new Date().toISOString(),
        accountId,
        categoryId: inactiveCategoryId,
      });

    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.status).toBeLessThan(500);
  });

  it("active category is still usable for new transactions", async () => {
    const res = await request(getApp().getHttpServer())
      .post("/api/transactions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        amount: 100,
        type: "EXPENSE",
        date: new Date().toISOString(),
        accountId,
        categoryId: activeCategoryId,
      });

    expect(res.status).toBe(201);
  });
});
