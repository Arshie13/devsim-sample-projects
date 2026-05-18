import { beforeAll, afterAll, afterEach } from "vitest";
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { AppModule } from "../../src/app.module";
import { PrismaService } from "../../src/prisma/prisma.service";

process.env.DATABASE_URL = process.env.DATABASE_URL_TEST ?? process.env.DATABASE_URL;
process.env.JWT_SECRET = process.env.JWT_SECRET ?? "test-secret-change-me";
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
  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE order_items, orders, products, categories, users RESTART IDENTITY CASCADE`
  );
});
