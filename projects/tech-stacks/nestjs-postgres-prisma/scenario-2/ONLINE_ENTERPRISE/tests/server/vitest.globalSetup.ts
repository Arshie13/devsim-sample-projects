import { execSync } from "child_process";

export async function setup() {
  // Push the Prisma schema to the test database once before all test suites.
  const testUrl = process.env.DATABASE_URL_TEST
    || process.env.DATABASE_URL
    || "postgresql://postgres:bambam073004@localhost:5432/brewhaven_test?schema=public";
  execSync("npx prisma db push --force-reset", {
    env: { ...process.env, DATABASE_URL: testUrl },
    stdio: "inherit",
  });
}
