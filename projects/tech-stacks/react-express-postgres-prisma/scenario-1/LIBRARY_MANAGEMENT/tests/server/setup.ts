import { beforeAll, afterAll, afterEach, vi } from 'vitest';
import { config as loadEnv } from 'dotenv';
import { fileURLToPath } from 'node:url';

// Prefer scenario-local server credentials for integration tests.
loadEnv({ path: fileURLToPath(new URL('../../server/.env', import.meta.url)) });

// Setup test environment variables
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL =
  process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/library_management?schema=public';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key';
process.env.PORT = '5001';

// Mock Prisma
vi.mock('./src/utils/prisma.js', () => ({
  connectDatabase: vi.fn().mockResolvedValue(undefined),
  disconnectDatabase: vi.fn().mockResolvedValue(undefined),
  default: {
    $connect: vi.fn().mockResolvedValue(undefined),
    $disconnect: vi.fn().mockResolvedValue(undefined),
    $transaction: vi.fn((fn) => fn(defaultMockPrisma)),
  },
}));

// Global beforeAll hook
beforeAll(async () => {
  // Set up any global test resources
});

// Global afterEach hook
afterEach(async () => {
  // Clean up after each test
  vi.clearAllMocks();
});

// Global afterAll hook
afterAll(async () => {
  // Clean up global test resources
});

// Default mock Prisma instance
export const defaultMockPrisma = {
  user: {
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  book: {
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  member: {
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  walkInBorrower: {
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  borrowRecord: {
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  $transaction: vi.fn((fn) => fn(defaultMockPrisma)),
};
