// @ts-nocheck
import { beforeAll, afterAll, afterEach, vi } from 'vitest';
import { config as loadEnv } from 'dotenv';
import { fileURLToPath } from 'node:url';

// Prefer scenario-local server credentials for integration tests.
loadEnv({ path: fileURLToPath(new URL('../../server/.env', import.meta.url)) });

// Setup test environment variables
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL =
  process.env.DATABASE_URL ||
  'postgresql://studyuser:studypassword@localhost:5432/study_planner_test?schema=public';
process.env.NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || 'test-secret-key';
process.env.NEXTAUTH_URL = 'http://localhost:3000';

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