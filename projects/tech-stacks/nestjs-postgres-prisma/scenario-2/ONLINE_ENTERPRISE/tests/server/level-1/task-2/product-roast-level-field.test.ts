import { describe, it, expect, beforeEach } from "vitest";
import * as request from "supertest";
import { getApp } from "../../setup";
import { createTestUser, signInToken, createTestCategory, createTestProduct } from "../../testUtils";

describe("Level 1 / Task 2 — Product roastLevel Field", () => {
  let adminToken: string;
  let categoryId: string;

  beforeEach(async () => {
    const admin = await createTestUser({ role: "ADMIN" });
    adminToken = await signInToken(admin.email);
    const category = await createTestCategory({ name: "Coffee Beans" });
    categoryId = category.id;
  });

  it("creates a product with a roastLevel and returns it", async () => {
    const res = await request(getApp().getHttpServer())
      .post("/api/products")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Ethiopian Yirgacheffe",
        price: 18.99,
        image: "yirgacheffe.jpg",
        sku: "ETH-YIR-001",
        stock: 20,
        categoryId,
        roastLevel: "Light",
      });

    expect(res.status).toBe(201);
    expect(res.body.roastLevel).toBe("Light");
  });

  it("creates a product without a roastLevel (field is optional)", async () => {
    const res = await request(getApp().getHttpServer())
      .post("/api/products")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Generic Coffee",
        price: 12.99,
        image: "generic.jpg",
        sku: "GEN-001",
        stock: 10,
        categoryId,
      });

    expect(res.status).toBe(201);
    expect(res.body.roastLevel == null).toBe(true);
  });

  it("roastLevel persists and appears in the product list", async () => {
    await createTestProduct(categoryId, { name: "Dark Roast", roastLevel: "Dark" });

    const res = await request(getApp().getHttpServer()).get("/api/products");
    expect(res.status).toBe(200);

    const products = res.body.data ?? res.body;
    const product = products.find((p: any) => p.name === "Dark Roast");
    expect(product).toBeDefined();
    expect(product.roastLevel).toBe("Dark");
  });
});
