/**
 * Level 5 Task 2: Export Tasks to CSV - Client Unit Contract Tests
 *
 * These tests are output-oriented and intentionally fail on starter code.
 * They verify the required implementation contract directly in real source files,
 * with no runtime mocks.
 */

import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

const readAnalyticsPage = async () =>
  readFile('../../../../src/app/analytics/page.tsx', 'utf8');

const readTasksApi = async () =>
  readFile('../../../../src/app/api/tasks/route.ts', 'utf8');

describe('Level 5 Task 2: Export Tasks to CSV Client Contracts', () => {
  describe('AC-1: Export Button Contract', () => {
    it('should define export button in analytics page', async () => {
      const pageCode = await readAnalyticsPage();

      expect(pageCode).toMatch(/export|download|csv/i);
      expect(pageCode).toMatch(/button|link/);
    });

    it('should have export to CSV functionality', async () => {
      const pageCode = await readAnalyticsPage();

      expect(pageCode).toMatch(/csv|comma.*separated|\.csv/i);
    });
  });

  describe('AC-2: Analytics Overview Endpoint', () => {
    it('should define GET /api/analytics/overview endpoint', async () => {
      const routeCode = await readTasksApi();

      expect(routeCode).toMatch(/analytics.*overview|overview.*analytics/i);
      expect(routeCode).toMatch(/totalTasks|completionRate|averageProgress/i);
    });

    it('should return task counts and completion statistics', async () => {
      const routeCode = await readTasksApi();

      expect(routeCode).toMatch(/completed|pending|total/i);
    });
  });

  describe('AC-3: CSV Generation', () => {
    it('should generate CSV with task headers', async () => {
      const pageCode = await readAnalyticsPage();

      expect(pageCode).toMatch(/title|subject|deadline|status|priority/i);
    });

    it('should include all task data in export', async () => {
      const pageCode = await readAnalyticsPage();

      expect(pageCode).toMatch(/map|forEach|reduce/i);
    });
  });
});

describe('Level 5 Task 2: Hidden Contract Guards', () => {
  it('should handle empty tasks gracefully in export', async () => {
    const pageCode = await readAnalyticsPage();

    expect(pageCode).toMatch(/empty|no.*task|length.*0/i);
  });

  it('should include date formatting in CSV output', async () => {
    const pageCode = await readAnalyticsPage();

    expect(pageCode).toMatch(/toISOString|date|format/i);
  });
});