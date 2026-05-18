import * as bcrypt from "bcrypt";
import * as request from "supertest";
import { getApp, getPrisma } from "./setup";

let userCounter = 0;
let productCounter = 0;

export async function createTestUser(overrides: {
  role?: "ADMIN" | "CASHIER";
  email?: string;
  name?: string;
} = {}): Promise<{ id: string; email: string; password: string; role: string }> {
  const prisma = getPrisma();
  const idx = ++userCounter;
  const plainPassword = "password123";
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const user = await prisma.user.create({
    data: {
      email: overrides.email ?? `testuser${idx}@test.com`,
      name: overrides.name ?? `Test User ${idx}`,
      password: hashedPassword,
      role: overrides.role ?? "CASHIER",
    },
  });

  return { ...user, password: plainPassword };
}

export async function signInToken(email: string, password = "password123"): Promise<string> {
  const res = await request(getApp().getHttpServer())
    .post("/api/auth/login")
    .send({ email, password });

  if (!res.body.access_token) {
    throw new Error(`signInToken failed for ${email}: ${JSON.stringify(res.body)}`);
  }
  return res.body.access_token;
}

export async function createTestCategory(overrides: {
  name?: string;
  isActive?: boolean;
} = {}): Promise<{ id: string; name: string }> {
  const prisma = getPrisma();
  const idx = ++productCounter;
  return prisma.category.create({
    data: {
      name: overrides.name ?? `Test Category ${idx}`,
      isActive: overrides.isActive ?? true,
    },
  });
}

export async function createTestProduct(
  categoryId: string,
  overrides: {
    name?: string;
    price?: number;
    stock?: number;
    lowStock?: number;
    isActive?: boolean;
  } = {}
): Promise<{ id: string; name: string; sku: string; price: any }> {
  const prisma = getPrisma();
  const idx = ++productCounter;
  const sku = `SKU-TEST-${idx}-${Date.now()}`;

  const product = await prisma.product.create({
    data: {
      name: overrides.name ?? `Test Product ${idx}`,
      sku,
      price: overrides.price ?? 10.0,
      isActive: overrides.isActive ?? true,
      categoryId,
      inventory: {
        create: {
          quantity: overrides.stock ?? 50,
          lowStock: overrides.lowStock ?? 10,
        },
      },
    },
    include: { inventory: true },
  });

  return product;
}

export async function createTestSettings(overrides: {
  taxRate?: number;
  storeName?: string;
  acceptCash?: boolean;
  acceptCard?: boolean;
} = {}): Promise<{ id: string }> {
  const prisma = getPrisma();
  return prisma.setting.create({
    data: {
      storeName: overrides.storeName ?? "Test POS Store",
      taxRate: overrides.taxRate ?? 0,
      acceptCash: overrides.acceptCash ?? true,
      acceptCard: overrides.acceptCard ?? true,
    },
  });
}
