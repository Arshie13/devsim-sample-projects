/**
 * Database smoke check used by the Level 1 setup grader.
 *
 * It proves three things at once:
 *   1. The DATABASE_URL in .env is valid and Postgres is reachable.
 *   2. The Prisma migrations have been applied (the `employees` table exists).
 *   3. The seed script has been run (the table has at least one row).
 *
 * On success it prints `DB_OK ROWS=<n>` and exits 0; otherwise exits 1.
 */
import 'dotenv/config';
import { prisma } from '../src/lib/prisma';

async function run() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    const count = await prisma.employee.count();
    console.log(`DB_OK ROWS=${count}`);
    process.exit(0);
  } catch (error) {
    console.error('DB_CHECK_FAILED', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

void run();
