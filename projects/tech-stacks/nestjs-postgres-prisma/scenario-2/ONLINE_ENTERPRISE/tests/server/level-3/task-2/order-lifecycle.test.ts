import { describe, it, expect, beforeEach } from "vitest";
import * as request from "supertest";
import { getApp, getPrisma } from "../../setup";
import { createTestUser, signInToken, createTestCategory, createTestProduct } from "../../testUtils";

describe("Level 3 / Task 2 — Order Lifecycle State Machine", () => {
  let adminToken: string;
  let customerToken: string;
  let productId: string;

  beforeEach(async () => {
    const admin = await createTestUser({ role: "ADMIN" });
    adminToken = await signInToken(admin.email);
    const customer = await createTestUser({ role: "CUSTOMER" });
    customerToken = await signInToken(customer.email);

    const category = await createTestCategory({ name: "Coffee" });
    const product = await createTestProduct(category.id, { stock: 10, price: 15.00 });
    productId = product.id;
  });

  async function placeOrder(): Promise<string> {
    const res = await request(getApp().getHttpServer())
      .post("/api/orders")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ items: [{ productId, quantity: 1 }], shippingAddress: "1 Test Ave", paymentMethod: "CARD" });
    return res.body.id as string;
  }

  it("PENDING → PROCESSING succeeds", async () => {
    const orderId = await placeOrder();
    const res = await request(getApp().getHttpServer())
      .patch(`/api/orders/${orderId}/status`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "PROCESSING" });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("PROCESSING");
  });

  it("PROCESSING → SHIPPED succeeds", async () => {
    const orderId = await placeOrder();
    await request(getApp().getHttpServer())
      .patch(`/api/orders/${orderId}/status`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "PROCESSING" });

    const res = await request(getApp().getHttpServer())
      .patch(`/api/orders/${orderId}/status`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "SHIPPED" });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("SHIPPED");
  });

  it("invalid transition PENDING → DELIVERED is rejected with 400", async () => {
    const orderId = await placeOrder();
    const res = await request(getApp().getHttpServer())
      .patch(`/api/orders/${orderId}/status`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "DELIVERED" });

    expect(res.status).toBe(400);
  });

  it("any non-DELIVERED order can be CANCELLED", async () => {
    const orderId = await placeOrder();
    const res = await request(getApp().getHttpServer())
      .patch(`/api/orders/${orderId}/status`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "CANCELLED" });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("CANCELLED");
  });

  it("a DELIVERED order cannot be CANCELLED", async () => {
    const orderId = await placeOrder();
    const prisma = getPrisma();
    // Force order to DELIVERED state directly via DB to bypass transition guards
    await prisma.order.update({ where: { id: orderId }, data: { status: "DELIVERED" } });

    const res = await request(getApp().getHttpServer())
      .patch(`/api/orders/${orderId}/status`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "CANCELLED" });

    expect(res.status).toBe(400);
  });

  it("customer cannot update order status (admin only)", async () => {
    const orderId = await placeOrder();
    const res = await request(getApp().getHttpServer())
      .patch(`/api/orders/${orderId}/status`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ status: "PROCESSING" });

    expect(res.status).toBeGreaterThanOrEqual(401);
    expect(res.status).toBeLessThanOrEqual(403);
  });
});
