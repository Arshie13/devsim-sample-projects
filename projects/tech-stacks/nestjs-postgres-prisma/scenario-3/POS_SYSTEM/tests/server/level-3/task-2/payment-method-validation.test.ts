import { describe, it, expect, beforeEach } from "vitest";
import * as request from "supertest";
import { getApp } from "../../setup";
import {
  createTestUser,
  signInToken,
  createTestCategory,
  createTestProduct,
  createTestSettings,
} from "../../testUtils";

describe("Level 3 / Task 2 — Payment Method Validation", () => {
  let cashierToken: string;
  let productId: string;

  beforeEach(async () => {
    const cashier = await createTestUser({ role: "CASHIER" });
    cashierToken = await signInToken(cashier.email);

    await createTestSettings({});

    const category = await createTestCategory({ name: "Coffee" });
    const product = await createTestProduct(category.id, { stock: 20, price: 10.0 });
    productId = product.id;
  });

  const placeOrder = (paymentMethod: string) =>
    request(getApp().getHttpServer())
      .post("/api/orders")
      .set("Authorization", `Bearer ${cashierToken}`)
      .send({
        items: [{ productId, quantity: 1 }],
        paymentMethod,
      });

  it("CASH payment method is accepted", async () => {
    const res = await placeOrder("CASH");
    expect(res.status).toBe(201);
  });

  it("CARD payment method is accepted", async () => {
    const res = await placeOrder("CARD");
    expect(res.status).toBe(201);
  });

  it("CRYPTO payment method returns 400", async () => {
    const res = await placeOrder("CRYPTO");
    expect(res.status).toBe(400);
  });

  it("BITCOIN payment method returns 400", async () => {
    const res = await placeOrder("BITCOIN");
    expect(res.status).toBe(400);
  });

  it("empty string payment method returns 400", async () => {
    const res = await placeOrder("");
    expect(res.status).toBe(400);
  });

  it("missing paymentMethod returns 400", async () => {
    const res = await request(getApp().getHttpServer())
      .post("/api/orders")
      .set("Authorization", `Bearer ${cashierToken}`)
      .send({ items: [{ productId, quantity: 1 }] });

    expect(res.status).toBe(400);
  });
});
