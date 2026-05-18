/**
 * Level 2 Task 1: Environment Setup & Priority Field - Client Unit Contract Tests
 *
 * These tests are output-oriented and intentionally fail on starter code.
 * They verify the required implementation contract directly in real source files,
 * with no runtime mocks.
 */

import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

const readPrismaSchema = async () =>
  readFile('../../../../prisma/schema.prisma', 'utf8');

const readTasksPage = async () =>
  readFile('../../../../src/app/page.tsx', 'utf8');

describe('Level 2 Task 1: Environment Setup Client Contracts', () => {
  describe('AC-1: Priority Field in Schema', () => {
    it('should add priority field to Task model in schema', async () => {
      const schemaCode = await readPrismaSchema();

      expect(schemaCode).toMatch(/model\s+Task/);
      expect(schemaCode).toMatch(/priority.*String|String.*priority/);
      expect(schemaCode).toMatch(/low.*medium.*high|low|medium|high/);
    });

    it('should have optional priority field', async () => {
      const schemaCode = await readPrismaSchema();

      expect(schemaCode).toMatch(/priority.*\?/);
    });
  });

  describe('AC-2: Priority Display in UI', () => {
    it('should display priority in tasks page', async () => {
      const pageCode = await readTasksPage();

      expect(pageCode).toMatch(/priority|Priority/i);
    });

    it('should show priority indicators', async () => {
      const pageCode = await readTasksPage();

      expect(pageCode).toMatch(/high|medium|low/i);
    });
  });

  describe('AC-3: Priority in Task Creation', () => {
    it('should allow setting priority when creating tasks', async () => {
      const pageCode = await readTasksPage();

      expect(pageCode).toMatch(/priority.*select|priority.*dropdown|priority.*option/i);
    });
  });
});

describe('Level 2 Task 1: Hidden Contract Guards', () => {
  it('should handle missing priority gracefully', async () => {
    const pageCode = await readTasksPage();

    expect(pageCode).toMatch(/default|optional|null/i);
  });

  it('should color-code priority levels', async () => {
    const pageCode = await readTasksPage();

    expect(pageCode).toMatch(/color|style.*priority|class.*priority/i);
  });
});