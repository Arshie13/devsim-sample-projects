import { describe, it, expect, beforeEach } from "vitest";
import * as request from "supertest";
import { getApp } from "../../setup";
import { createTestUser, signInToken, createTestAccount, createTestCategory } from "../../testUtils";

describe("Level 1 / Task 2 — Transaction note Field", () => {
  let token: string;
  let accountId: string;
  let categoryId: string;

  beforeEach(async () => {
    const user = await createTestUser();
    token = await signInToken(user.email);
    const account = await createTestAccount(user.id, { balance: 5000 });
    accountId = account.id;
    const category = await createTestCategory(user.id, { type: "EXPENSE" });
    categoryId = category.id;
  });

  it("creates a transaction with a note and returns it", async () => {
    const res = await request(getApp().getHttpServer())
      .post("/api/transactions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        amount: 100,
        type: "EXPENSE",
        date: new Date().toISOString(),
        accountId,
        categoryId,
        note: "lunch with team",
      });

    expect(res.status).toBe(201);
    expect(res.body.note).toBe("lunch with team");
  });

  it("creates a transaction without a note (note is optional)", async () => {
    const res = await request(getApp().getHttpServer())
      .post("/api/transactions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        amount: 50,
        type: "EXPENSE",
        date: new Date().toISOString(),
        accountId,
        categoryId,
      });

    expect(res.status).toBe(201);
    expect(res.body).not.toHaveProperty("note", expect.stringContaining(""));
  });

  it("note persists and appears in the transaction list", async () => {
    await request(getApp().getHttpServer())
      .post("/api/transactions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        amount: 200,
        type: "EXPENSE",
        date: new Date().toISOString(),
        accountId,
        categoryId,
        note: "groceries",
      });

    const listRes = await request(getApp().getHttpServer())
      .get("/api/transactions")
      .set("Authorization", `Bearer ${token}`);

    expect(listRes.status).toBe(200);
    const notes = (listRes.body.data ?? listRes.body).map((t: any) => t.note);
    expect(notes).toContain("groceries");
  });
});
