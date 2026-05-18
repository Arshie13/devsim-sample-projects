import * as request from "supertest";
import { getApp, getPrisma } from "./setup";
import * as bcrypt from "bcrypt";

export async function createTestUser(overrides: {
  email?: string;
  name?: string;
  role?: "USER" | "ADMIN";
} = {}) {
  const prisma = getPrisma();
  const email = overrides.email ?? `user_${Math.random().toString(36).slice(2, 8)}@test.com`;
  const passwordHash = await bcrypt.hash("password123", 10);
  return prisma.user.create({
    data: {
      email,
      password: passwordHash,
      name: overrides.name ?? "Test User",
      role: overrides.role ?? "USER",
    },
  });
}

export async function signInToken(email: string, password = "password123"): Promise<string> {
  const res = await request(getApp().getHttpServer())
    .post("/api/auth/login")
    .send({ email, password });
  return res.body.access_token as string;
}

export async function createTestAccount(userId: string, overrides: {
  name?: string;
  type?: string;
  balance?: number;
  allowNegativeBalance?: boolean;
} = {}) {
  const prisma = getPrisma();
  return prisma.account.create({
    data: {
      name: overrides.name ?? "Test Account",
      type: (overrides.type as any) ?? "CASH",
      balance: overrides.balance ?? 1000,
      allowNegativeBalance: overrides.allowNegativeBalance ?? false,
      userId,
    },
  });
}

export async function createTestCategory(userId: string, overrides: {
  name?: string;
  type?: string;
  isActive?: boolean;
} = {}) {
  const prisma = getPrisma();
  return prisma.category.create({
    data: {
      name: overrides.name ?? "Test Category",
      type: (overrides.type as any) ?? "EXPENSE",
      isActive: overrides.isActive ?? true,
      userId,
    },
  });
}
