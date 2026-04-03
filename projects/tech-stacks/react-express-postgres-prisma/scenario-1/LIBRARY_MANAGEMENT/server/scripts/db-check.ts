import 'dotenv/config';
import { prisma } from '../src/utils/prisma.js';

const run = async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('DB_OK');
    process.exit(0);
  } catch (error) {
    console.error('DB_CHECK_FAILED', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

void run();