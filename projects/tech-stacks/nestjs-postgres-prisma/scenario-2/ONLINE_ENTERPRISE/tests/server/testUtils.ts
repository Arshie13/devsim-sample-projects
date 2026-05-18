import * as request from "supertest";
import { getApp, getPrisma } from "./setup";
import * as bcrypt from "bcrypt";

export async function createTestUser(overrides: {
  email?: string;
  name?: string;
  role?: "ADMIN" | "CUSTOMER";
} = {}) {
  const prisma = getPrisma();
  const email = overrides.email ?? `user_${Math.random().toString(36).slice(2, 8)}@test.com`;
  const passwordHash = await bcrypt.hash("password123", 10);
  return prisma.user.create({
    data: {
      email,
      password: passwordHash,
      name: overrides.name ?? "Test User",
      role: overrides.role ?? "CUSTOMER",
    },
  });
}

export async function signInToken(email: string, password = "password123"): Promise<string> {
  const res = await request(getApp().getHttpServer())
    .post("/api/auth/login")
    .send({ email, password });
  return res.body.access_token as string;
}

export async function createTestCategory(overrides: {
  name?: string;
  isActive?: boolean;
} = {}) {
  const prisma = getPrisma();
  return prisma.category.create({
    data: {
      name: overrides.name ?? `Category_${Math.random().toString(36).slice(2, 6)}`,
      isActive: overrides.isActive ?? true,
    },
  });
}

export async function createTestProduct(categoryId: string, overrides: {
  name?: string;
  price?: number;
  stock?: number;
  roastLevel?: string;
  isActive?: boolean;
} = {}) {
  const prisma = getPrisma();
  const sku = `SKU-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  return prisma.product.create({
    data: {
      name: overrides.name ?? "Test Coffee",
      description: "A test product",
      price: overrides.price ?? 25.00,
      image: "test.jpg",
      sku,
      stock: overrides.stock ?? 50,
      roastLevel: overrides.roastLevel,
      isActive: overrides.isActive ?? true,
      categoryId,
    },
  });
}
