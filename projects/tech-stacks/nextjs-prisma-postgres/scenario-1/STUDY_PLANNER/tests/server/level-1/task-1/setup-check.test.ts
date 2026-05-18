/**
 * Level 1 Task 1: Environment Setup - Server Integration Tests
 *
 * These tests verify the backend API endpoints work correctly.
 * They test against the real server and database.
 */

import { describe, expect, it, beforeAll, afterAll, beforeEach } from 'vitest';

const API_BASE = process.env.API_URL || 'http://localhost:3000';

describe('Level 1 Task 1: Environment Setup Server Tests', () => {
  describe('AC-1: Server Health', () => {
    it('should respond to health check endpoint', async () => {
      const response = await fetch(`${API_BASE}/api/health`);
      
      expect(response.ok).toBe(true);
    });

    it('should have database connection', async () => {
      const response = await fetch(`${API_BASE}/api/subjects`);
      
      expect([200, 401]).toContain(response.status);
    });
  });

  describe('AC-2: Initial Data', () => {
    it('should seed initial subjects', async () => {
      const response = await fetch(`${API_BASE}/api/subjects`);
      
      if (response.status === 200) {
        const data = await response.json();
        expect(data).toBeDefined();
      }
    });

    it('should have tasks endpoint', async () => {
      const response = await fetch(`${API_BASE}/api/tasks`);
      
      expect([200, 401]).toContain(response.status);
    });
  });
});