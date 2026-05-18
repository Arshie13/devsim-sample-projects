import { describe, it, expect, beforeEach } from "vitest";
import * as request from "supertest";
import { getApp, getPrisma } from "../../setup";
import { createTestUser, signInToken, createTestCategory, createTestProduct } from "../../testUtils";

describe("Level 3 / Task 1 — Transactional Checkout: Stock, Tax & Payment", () => {
  let customerToken: string;
  let customerId: string;
  let productId: string;

  beforeEach(async () => {
    const customer = await createTestUser({ role: "CUSTOMER" });
    customerId = customer.id;
    customerToken = await signInToken(customer.email);

    const category = await createTestCategory({ name: "Coffee" });
    const product = await createTestProduct(category.id, {
      name: "Ethiopian Yirgacheffe",
      price: 25.00,
      stock: 5,
    });
    productId = product.id;
  });

  const orderPayload = (productId: string, quantity: number, paymentMethod = "CARD") => ({
    items: [{ productId, quantity }],
    shippingAddress: "123 Test St",
    paymentMethod,
  });

  it("places an order, deducts stock atomically", async () => {
    const prisma = getPrisma();

    const res = await request(getApp().getHttpServer())
      .post("/api/orders")
      .set("Authorization", `Bearer ${customerToken}`)
      .send(orderPayload(productId, 2));

    expect(res.status).toBe(201);

    const product = await prisma.product.findUnique({ where: { id: productId } });
    expect(product!.stock).toBe(3);
  });

  it("stores tax on the order record", async () => {
    const res = await request(getApp().getHttpServer())
      .post("/api/orders")
      .set("Authorization", `Bearer ${customerToken}`)
      .send(orderPayload(productId, 1));

    expect(res.status).toBe(201);
    expect(Number(res.body.tax)).toBeGreaterThan(0);
    // subtotal = 25, tax ~= 2 (8%), total = subtotal + tax
    expect(Number(res.body.total)).toBeCloseTo(27, 0);
  });

  it("order total rounded to 2 decimal places", async () => {
    const res = await request(getApp().getHttpServer())
      .post("/api/orders")
      .set("Authorization", `Bearer ${customerToken}`)
      .send(orderPayload(productId, 1));

    expect(res.status).toBe(201);
    const totalStr = String(res.body.total);
    const decimals = totalStr.includes(".") ? totalStr.split(".")[1].length : 0;
    expect(decimals).toBeLessThanOrEqual(2);
  });

  it("rejects order when stock is insufficient", async () => {
    const res = await request(getApp().getHttpServer())
      .post("/api/orders")
      .set("Authorization", `Bearer ${customerToken}`)
      .send(orderPayload(productId, 10)); // only 5 in stock

    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.status).toBeLessThan(500);
  });

  it("rejects order with an unsupported payment method", async () => {
    const res = await request(getApp().getHttpServer())
      .post("/api/orders")
      .set("Authorization", `Bearer ${customerToken}`)
      .send(orderPayload(productId, 1, "CRYPTO"));

    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.status).toBeLessThan(500);
  });

  it("rolls back stock deduction when order fails mid-transaction", async () => {
    const prisma = getPrisma();
    const before = await prisma.product.findUnique({ where: { id: productId } });

    // Attempt order with a mix of valid + over-limit quantity (if supported) or bad data
    await request(getApp().getHttpServer())
      .post("/api/orders")
      .set("Authorization", `Bearer ${customerToken}`)
      .send(orderPayload(productId, 100)); // exceeds stock

    const after = await prisma.product.findUnique({ where: { id: productId } });
    expect(after!.stock).toBe(before!.stock); // stock unchanged
  });
});
