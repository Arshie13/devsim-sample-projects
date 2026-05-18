/**
 * Level 5 Task 1: Study Analytics - Client Unit Contract Tests
 *
 * These tests are output-oriented and intentionally fail on starter code.
 * They verify the required implementation contract directly in real source files.
 */

import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

const readAnalyticsApi = async () =>
  readFile('../../../../src/app/api/analytics/overview/route.ts', 'utf8');

const readAnalyticsPage = async () =>
  readFile('../../../../src/app/analytics/page.tsx', 'utf8');

describe('Level 5 Task 1: Study Analytics Client Contracts', () => {
  describe('AC-1: Overview Endpoint', () => {
    it('should define GET /api/analytics/overview', async () => {
      const routeCode = await readAnalyticsApi();

      expect(routeCode).toMatch(/export.*async.*GET|GET.*handler/i);
      expect(routeCode).toMatch(/analytics.*overview|overview/i);
    });

    it('should return total tasks count', async () => {
      const routeCode = await readAnalyticsApi();

      expect(routeCode).toMatch(/totalTasks|tasks.*count/i);
    });

    it('should return completion rate', async () => {
      const routeCode = await readAnalyticsApi();

      expect(routeCode).toMatch(/completionRate|completed.*percent/i);
    });
  });

  describe('AC-2: Subject Breakdown', () => {
    it('should have subject breakdown endpoint', async () => {
      const pageCode = await readAnalyticsPage();

      expect(pageCode).toMatch(/subject.*breakdown|by.*subject/i);
    });

    it('should show progress per subject', async () => {
      const pageCode = await readAnalyticsPage();

      expect(pageCode).toMatch(/subject.*progress|progress.*subject/i);
    });
  });

  describe('AC-3: Time Tracking', () => {
    it('should estimate study time', async () => {
      const pageCode = await readAnalyticsPage();

      expect(pageCode).toMatch(/studyTime|time.*estimate|Hours/i);
    });
  });
});

describe('Level 5 Task 1: Hidden Contract Guards', () => {
  it('should handle empty analytics gracefully', async () => {
    const pageCode = await readAnalyticsPage();

    expect(pageCode).toMatch(/no.*task|empty|zero/i);
  });
});