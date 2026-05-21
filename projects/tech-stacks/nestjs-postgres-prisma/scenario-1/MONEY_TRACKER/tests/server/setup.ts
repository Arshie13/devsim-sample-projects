import "reflect-metadata";
import { beforeAll, afterAll, afterEach } from "vitest";
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { AppModule } from "../../src/app.module";
import { PrismaService } from "../../src/prisma/prisma.service";

// Hardcoded fallbacks so tests run without .env files (matches MERN/PNR pattern).
process.env.DATABASE_URL_TEST = process.env.DATABASE_URL_TEST
  || process.env.DATABASE_URL
  || "postgresql://postgres:bambam073004@localhost:5432/flexispend_test?schema=public";
process.env.DATABASE_URL = process.env.DATABASE_URL_TEST;
process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret-change-me";
process.env.NODE_ENV = "test";

let app: INestApplication;
let prisma: PrismaService;

export function getApp() {
  return app;
}

export function getPrisma() {
  return prisma;
}

beforeAll(async () => {
  const moduleRef: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleRef.createNestApplication();
  app.setGlobalPrefix("api");
  await app.init();

  prisma = moduleRef.get(PrismaService);
});

afterAll(async () => {
  await app.close();
});

afterEach(async () => {
  // Truncate all tables between tests so each test starts with a clean DB.
  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE budgets, transactions, accounts, categories, users RESTART IDENTITY CASCADE`
  );
});
