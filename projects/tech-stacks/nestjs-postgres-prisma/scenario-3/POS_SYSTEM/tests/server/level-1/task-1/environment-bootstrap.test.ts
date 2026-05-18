import { describe, it, expect } from "vitest";
import * as request from "supertest";
import { getApp, getPrisma } from "../../setup";

describe("Level 1 / Task 1 — Environment Setup", () => {
  it("application boots and getApp() returns a running Nest app", () => {
    const app = getApp();
    expect(app).toBeDefined();
    expect(app.getHttpServer()).toBeDefined();
  });

  it("Prisma connects to the test database", async () => {
    const prisma = getPrisma();
    const result = await prisma.$queryRaw<[{ one: number }]>`SELECT 1 AS one`;
    expect(Number(result[0].one)).toBe(1);
  });

  it("GET /api returns a response (not 5xx)", async () => {
    const res = await request(getApp().getHttpServer()).get("/api");
    expect(res.status).toBeLessThan(500);
  });

  it("POST /api/auth/login with wrong credentials returns 401", async () => {
    const res = await request(getApp().getHttpServer())
      .post("/api/auth/login")
      .send({ email: "nobody@nowhere.com", password: "wrong" });
    expect(res.status).toBe(401);
  });

  it("POST /api/auth/login with valid seeded credentials returns a JWT", async () => {
    const { createTestUser, signInToken } = await import("../../testUtils");
    const user = await createTestUser({ role: "ADMIN" });
    const token = await signInToken(user.email);
    expect(typeof token).toBe("string");
    expect(token.length).toBeGreaterThan(10);
  });
});
