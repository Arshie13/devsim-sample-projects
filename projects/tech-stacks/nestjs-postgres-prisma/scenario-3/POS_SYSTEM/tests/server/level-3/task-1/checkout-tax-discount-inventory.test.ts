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

describe("Level 3 / Task 1 — Transactional Checkout: Tax, Discount & Inventory", () => {
  let cashierToken: string;
  let productId: string;

  beforeEach(async () => {
    const cashier = await createTestUser({ role: "CASHIER" });
    cashierToken = await signInToken(cashier.email);

    await createTestSettings({ taxRate: 10 });

    const category = await createTestCategory({ name: "Coffee" });
    const product = await createTestProduct(category.id, {
      name: "Ethiopian Yirgacheffe",
      price: 20.0,
      stock: 10,
    });
    productId = product.id;
  });

  const placeOrder = (token: string, items: any[], discount = 0) =>
    request(getApp().getHttpServer())
      .post("/api/orders")
      .set("Authorization", `Bearer ${token}`)
      .send({
        items,
        paymentMethod: "CASH",
        discountAmount: discount,
      });

  it("successful checkout creates an order with correct subtotal, tax, and total", async () => {
    const res = await placeOrder(cashierToken, [{ productId, quantity: 2 }]);

    expect(res.status).toBe(201);
    const subtotal = Number(res.body.subtotal);
    const tax = Number(res.body.tax);
    const total = Number(res.body.total);

    expect(subtotal).toBe(40.0);
    expect(tax).toBeGreaterThan(0);
    expect(total).toBeCloseTo(subtotal + tax, 2);
  });

  it("tax equals subtotal × (taxRate / 100) from Settings", async () => {
    const res = await placeOrder(cashierToken, [{ productId, quantity: 1 }]);

    expect(res.status).toBe(201);
    const subtotal = Number(res.body.subtotal);
    const tax = Number(res.body.tax);
    // taxRate = 10 → tax = subtotal * 0.10
    expect(tax).toBeCloseTo(subtotal * 0.1, 2);
  });

  it("discountAmount is subtracted from the total", async () => {
    const res = await placeOrder(cashierToken, [{ productId, quantity: 1 }], 5);

    expect(res.status).toBe(201);
    const subtotal = Number(res.body.subtotal);
    const tax = Number(res.body.tax);
    const discount = Number(res.body.discount);
    const total = Number(res.body.total);

    expect(discount).toBe(5);
    expect(total).toBeCloseTo(subtotal + tax - discount, 2);
  });

  it("inventory quantity is decremented by the ordered amount after checkout", async () => {
    const prisma = getPrisma();
    const before = await prisma.inventory.findFirst({ where: { productId } });
    const beforeQty = before!.quantity;

    const res = await placeOrder(cashierToken, [{ productId, quantity: 3 }]);
    expect(res.status).toBe(201);

    const after = await prisma.inventory.findFirst({ where: { productId } });
    expect(after!.quantity).toBe(beforeQty - 3);
  });

  it("checkout with insufficient stock returns 4xx and leaves inventory unchanged", async () => {
    const prisma = getPrisma();
    const before = await prisma.inventory.findFirst({ where: { productId } });
    const beforeQty = before!.quantity;

    const res = await placeOrder(cashierToken, [{ productId, quantity: 999 }]);

    expect(res.status).toBeGreaterThanOrEqual(400);

    const after = await prisma.inventory.findFirst({ where: { productId } });
    expect(after!.quantity).toBe(beforeQty);
  });

  it("order total has at most 2 decimal places", async () => {
    const category = await createTestCategory({ name: "Syrup" });
    // price chosen to produce floating-point drift when multiplied
    const p2 = await createTestProduct(category.id, { price: 4.67, stock: 10 });

    const res = await placeOrder(cashierToken, [{ productId: p2.id, quantity: 3 }]);
    expect(res.status).toBe(201);

    const totalStr = String(res.body.total);
    const decimals = totalStr.includes(".") ? totalStr.split(".")[1].length : 0;
    expect(decimals).toBeLessThanOrEqual(2);
  });
});
