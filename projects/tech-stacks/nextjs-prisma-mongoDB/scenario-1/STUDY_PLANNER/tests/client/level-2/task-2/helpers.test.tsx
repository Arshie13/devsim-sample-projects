/**
 * Level 2 Task 2: Filter and Sort Helpers - Client Unit Contract Tests
 *
 * These tests are output-oriented and intentionally fail on starter code.
 * They verify the required implementation contract directly in real source files.
 */

import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

const readTasksApi = async () =>
  readFile('../../../../src/app/api/tasks/route.ts', 'utf8');

const readUtils = async () =>
  readFile('../../../../src/utils/helpers.ts', 'utf8');

describe('Level 2 Task 2: Filter and Sort Client Contracts', () => {
  describe('AC-1: Status Filter Support', () => {
    it('should support status query parameter in tasks API', async () => {
      const routeCode = await readTasksApi();

      expect(routeCode).toMatch(/status.*completed.*pending|completed.*pending.*status/i);
    });

    it('should filter by status in GET handler', async () => {
      const routeCode = await readTasksApi();

      expect(routeCode).toMatch(/status.*===|status.*==|=.*status/i);
    });
  });

  describe('AC-2: Priority Filter Support', () => {
    it('should support priority query parameter', async () => {
      const routeCode = await readTasksApi();

      expect(routeCode).toMatch(/priority.*low.*medium.*high/i);
    });

    it('should filter by priority level', async () => {
      const routeCode = await readTasksApi();

      expect(routeCode).toMatch(/priority.*=.*query|query.*priority/i);
    });
  });

  describe('AC-3: Sort Support', () => {
    it('should support sortBy query parameter', async () => {
      const routeCode = await readTasksApi();

      expect(routeCode).toMatch(/sortBy.*deadline.*createdAt.*priority/i);
    });

    it('should support sortOrder parameter', async () => {
      const routeCode = await readTasksApi();

      expect(routeCode).toMatch(/sortOrder.*asc.*desc/i);
    });
  });

  describe('AC-4: Helper Functions', () => {
    it('should export filterTasks helper function', async () => {
      const utilsCode = await readUtils();

      expect(utilsCode).toMatch(/filterTasks|filter.*Tasks/i);
    });

    it('should export sortTasks helper function', async () => {
      const utilsCode = await readUtils();

      expect(utilsCode).toMatch(/sortTasks|sort.*Tasks/i);
    });
  });
});

describe('Level 2 Task 2: Hidden Contract Guards', () {
  it('should handle default values for filters', async () => {
    const routeCode = await readTasksApi();

    expect(routeCode).toMatch(/default|all.*status/i);
  });

  it('should handle invalid sort parameters gracefully', async () => {
    const routeCode = await readTasksApi();

    expect(routeCode).toMatch(/sortBy.*deadline|fallback/i);
  });
});