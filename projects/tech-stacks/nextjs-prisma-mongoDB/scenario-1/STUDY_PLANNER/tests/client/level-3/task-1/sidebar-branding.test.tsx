/**
 * Level 3 Task 1: User Authentication & Brand - Client Unit Contract Tests
 *
 * These tests are output-oriented and intentionally fail on starter code.
 * They verify the required implementation contract directly in real source files.
 */

import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

const readLayout = async () =>
  readFile('../../../../src/app/layout.tsx', 'utf8');

const readPrismaSchema = async () =>
  readFile('../../../../prisma/schema.prisma', 'utf8');

describe('Level 3 Task 1: User Authentication Client Contracts', () => {
  describe('AC-1: User Model in Schema', () => {
    it('should define User model in Prisma schema', async () => {
      const schemaCode = await readPrismaSchema();

      expect(schemaCode).toMatch(/model\s+User/);
      expect(schemaCode).toMatch(/email.*String|password.*String|name.*String/i);
    });

    it('should have required User fields', async () => {
      const schemaCode = await readPrismaSchema();

      expect(schemaCode).toMatch(/email.*\@.*String|String.*\@/i);
      expect(schemaCode).toMatch(/password.*String|String.*password/i);
    });
  });

  describe('AC-2: Authentication Pages', () => {
    it('should have login page', async () => {
      const pageCode = await readLayout();

      expect(pageCode).toMatch(/login|signin|sign in/i);
    });

    it('should have register page', async () => {
      const pageCode = await readLayout();

      expect(pageCode).toMatch(/register|signup|sign up/i);
    });
  });

  describe('AC-3: Auth Integration', () => {
    it('should integrate with NextAuth or similar', async () => {
      const layoutCode = await readLayout();

      expect(layoutCode).toMatch(/nextauth|auth|provider/i);
    });
  });
});

describe('Level 3 Task 1: Hidden Contract Guards', () => {
  it('should protect authenticated routes', async () => {
    const pageCode = await readLayout();

    expect(pageCode).toMatch(/redirect|protected|middleware/i);
  });
});