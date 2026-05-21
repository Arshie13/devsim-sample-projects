import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { getApp, getPrisma } from "../../setup";
import {
  createTestUser,
  signInToken,
  createTestCategory,
  createTestProduct,
  createTestSettings,
} from "../../testUtils";

describe("Level 5 / Task 1 — Fix Oversell, Decimal Drift & Timezone", () => {
  let adminToken: string;
  let cashierToken: string;
  let productId: string;

  beforeEach(async () => {
    const admin = await createTestUser({ role: "ADMIN" });
    adminToken = await signInToken(admin.email);
    const cashier = await createTestUser({ role: "CASHIER" });
    cashierToken = await signInToken(cashier.email);

    await createTestSettings({ taxRate: 0 });

    const category = await createTestCategory({ name: "Coffee" });
    const product = await createTestProduct(category.id, {
      name: "Ethiopian Dark Roast",
      price: 18.99,
      stock: 1,
    });
    productId = product.id;
  });

  const placeOrder = (token: string, qty = 1) =>
    request(getApp().getHttpServer())
      .post("/api/orders")
      .set("Authorization", `Bearer ${token}`)
      .send({ items: [{ productId, quantity: qty }], paymentMethod: "CASH" });

  describe("Race condition — oversell fix", () => {
    it("only one of two concurrent checkouts succeeds for a 1-stock product", async () => {
      const [res1, res2] = await Promise.all([
        placeOrder(cashierToken),
        placeOrder(cashierToken),
      ]);

      const statuses = [res1.status, res2.status];
      expect(statuses).toContain(201);
      expect(statuses.filter((s) => s >= 400).length).toBe(1);
    });

    it("inventory quantity never goes negative after concurrent checkouts", async () => {
      const prisma = getPrisma();
      await Promise.all([placeOrder(cashierToken), placeOrder(cashierToken)]);

      const inv = await prisma.inventory.findFirst({ where: { productId } });
      expect(inv!.quantity).toBeGreaterThanOrEqual(0);
    });
  });

  describe("Decimal precision", () => {
    it("order total has at most 2 decimal places", async () => {
      const category = await createTestCategory({ name: "Syrup" });
      // price likely to cause floating-point drift (e.g. 4.67 × 3)
      const p2 = await createTestProduct(category.id, { price: 4.67, stock: 10 });

      const res = await request(getApp().getHttpServer())
        .post("/api/orders")
        .set("Authorization", `Bearer ${cashierToken}`)
        .send({ items: [{ productId: p2.id, quantity: 3 }], paymentMethod: "CARD" });

      expect(res.status).toBe(201);
      const totalStr = String(res.body.total);
      const decimals = totalStr.includes(".") ? totalStr.split(".")[1].length : 0;
      expect(decimals).toBeLessThanOrEqual(2);
    });
  });

  describe("Report timezone consistency", () => {
    it("daily report returns consistent orderCount on repeated calls", async () => {
      const cashier2 = await createTestUser({ role: "CASHIER" });
      const token2 = await signInToken(cashier2.email);
      const category = await createTestCategory({ name: "Extra" });
      const p2 = await createTestProduct(category.id, { stock: 10, price: 5.0 });

      await request(getApp().getHttpServer())
        .post("/api/orders")
        .set("Authorization", `Bearer ${token2}`)
        .send({ items: [{ productId: p2.id, quantity: 1 }], paymentMethod: "CASH" });

      const call1 = await request(getApp().getHttpServer())
        .get("/api/reports/daily")
        .set("Authorization", `Bearer ${adminToken}`);
      const call2 = await request(getApp().getHttpServer())
        .get("/api/reports/daily")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(call1.status).toBe(200);
      expect(call2.status).toBe(200);
      expect(call1.body.orderCount).toEqual(call2.body.orderCount);
    });
  });
});
