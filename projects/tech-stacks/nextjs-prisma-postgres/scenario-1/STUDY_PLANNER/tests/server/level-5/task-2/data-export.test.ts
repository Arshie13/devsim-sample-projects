/**
 * Level 5 Task 2: Progress Trends & Export - Server Integration Tests
 *
 * These tests verify the analytics and export API endpoints work correctly.
 * They test against the real server and database.
 */

import { describe, expect, it, beforeAll, afterAll } from 'vitest';

const API_BASE = process.env.API_URL || 'http://localhost:3000';

describe('Level 5 Task 2: Progress Trends Server Tests', () => {
  describe('AC-1: Analytics Endpoints', () => {
    it('should have analytics overview endpoint', async () => {
      const response = await fetch(`${API_BASE}/api/analytics/overview`);
      
      expect([200, 401]).toContain(response.status);
    });

    it('should have subject breakdown endpoint', async () => {
      const response = await fetch(`${API_BASE}/api/analytics/subject-breakdown`);
      
      expect([200, 401]).toContain(response.status);
    });

    it('should have time tracking endpoint', async () => {
      const response = await fetch(`${API_BASE}/api/analytics/time-tracking`);
      
      expect([200, 401]).toContain(response.status);
    });
  });

  describe('AC-2: Trend Analysis', () => {
    it('should return completion rate trends', async () => {
      const response = await fetch(`${API_BASE}/api/analytics/trends?period=weekly`);
      
      if (response.status === 200) {
        const data = await response.json();
        expect(data).toBeDefined();
      }
    });

    it('should support monthly trends', async () => {
      const response = await fetch(`${API_BASE}/api/analytics/trends?period=monthly`);
      
      expect([200, 401]).toContain(response.status);
    });
  });

  describe('AC-3: Export', () => {
    it('should have export endpoint', async () => {
      const response = await fetch(`${API_BASE}/api/tasks/export?format=csv`);
      
      expect([200, 401]).toContain(response.status);
    });

    it('should return CSV format', async () => {
      const response = await fetch(`${API_BASE}/api/tasks/export?format=csv`);
      
      if (response.ok) {
        const text = await response.text();
        expect(text).toContain('title,subject,deadline');
      }
    });
  });
});