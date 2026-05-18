import { describe, it, expect } from "vitest";
import * as request from "supertest";
import { getApp, getPrisma } from "../../setup";

describe("Level 1 / Task 1 — Environment Bootstrap", () => {
  it("app is defined", () => {
    expect(getApp()).toBeDefined();
  });

  it("prisma service connects to the database", async () => {
    const prisma = getPrisma();
    await expect(prisma.$queryRaw`SELECT 1`).resolves.toBeDefined();
  });

  it("GET /api returns a response (server is up)", async () => {
    const res = await request(getApp().getHttpServer()).get("/api");
    expect(res.status).toBeLessThan(500);
  });

  it("POST /api/auth/login returns 401 for invalid credentials", async () => {
    const res = await request(getApp().getHttpServer())
      .post("/api/auth/login")
      .send({ email: "nobody@test.com", password: "wrong" });
    expect(res.status).toBe(401);
  });
});
