import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { getApp, getPrisma } from "../../setup";
import { createTestUser, signInToken, createTestCategory, createTestProduct } from "../../testUtils";

describe("Level 5 / Task 1 — Fix Oversell, Decimal Drift & Timezone", () => {
  let adminToken: string;
  let customerToken: string;
  let productId: string;

  beforeEach(async () => {
    const admin = await createTestUser({ role: "ADMIN" });
    adminToken = await signInToken(admin.email);
    const customer = await createTestUser({ role: "CUSTOMER" });
    customerToken = await signInToken(customer.email);

    const category = await createTestCategory({ name: "Coffee" });
    const product = await createTestProduct(category.id, {
      name: "Ethiopian Yirgacheffe",
      price: 18.99,
      stock: 1,
    });
    productId = product.id;
  });

  const placeOrder = (token: string) =>
    request(getApp().getHttpServer())
      .post("/api/orders")
      .set("Authorization", `Bearer ${token}`)
      .send({ items: [{ productId, quantity: 1 }], shippingAddress: "1 Test Ave", paymentMethod: "CARD" });

  describe("Race condition — oversell fix", () => {
    it("only one of two concurrent checkouts succeeds for a 1-stock product", async () => {
      const [res1, res2] = await Promise.all([placeOrder(customerToken), placeOrder(customerToken)]);

      const statuses = [res1.status, res2.status];
      expect(statuses).toContain(201);
      expect(statuses.filter((s) => s >= 400).length).toBe(1);
    });

    it("stock never goes negative after concurrent checkouts", async () => {
      const prisma = getPrisma();
      await Promise.all([placeOrder(customerToken), placeOrder(customerToken)]);

      const product = await prisma.product.findUnique({ where: { id: productId } });
      expect(product!.stock).toBeGreaterThanOrEqual(0);
    });
  });

  describe("Decimal precision", () => {
    it("order total has at most 2 decimal places", async () => {
      const category = await (await import("../../testUtils")).createTestCategory({ name: "Extra" });
      // Use a price likely to produce floating-point drift (e.g., 1/3 cents)
      const product2 = await (await import("../../testUtils")).createTestProduct(category.id, {
        price: 10.01,
        stock: 10,
      });

      const res = await request(getApp().getHttpServer())
        .post("/api/orders")
        .set("Authorization", `Bearer ${customerToken}`)
        .send({ items: [{ productId: product2.id, quantity: 3 }], shippingAddress: "1 Test Ave", paymentMethod: "CARD" });

      expect(res.status).toBe(201);
      const totalStr = String(res.body.total);
      const decimals = totalStr.includes(".") ? totalStr.split(".")[1].length : 0;
      expect(decimals).toBeLessThanOrEqual(2);
    });
  });

  describe("Report timezone consistency", () => {
    it("daily report returns consistent order count on repeated calls", async () => {
      // Place an order
      const customer2 = await (await import("../../testUtils")).createTestUser({ role: "CUSTOMER" });
      const token2 = await (await import("../../testUtils")).signInToken(customer2.email);
      const category = await (await import("../../testUtils")).createTestCategory({ name: "Extra2" });
      const product2 = await (await import("../../testUtils")).createTestProduct(category.id, { stock: 10, price: 5.00 });

      await request(getApp().getHttpServer())
        .post("/api/orders")
        .set("Authorization", `Bearer ${token2}`)
        .send({ items: [{ productId: product2.id, quantity: 1 }], shippingAddress: "1 Test Ave", paymentMethod: "CASH" });

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
