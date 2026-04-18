/**
 * Level 3 Task 1: User Authentication - Server Integration Tests
 *
 * These tests verify the authentication API endpoints work correctly.
 * They test against the real server and database.
 */

import { describe, expect, it, beforeAll, afterAll } from 'vitest';

const API_BASE = process.env.API_URL || 'http://localhost:3000';

describe('Level 3 Task 1: User Authentication Server Tests', () => {
  describe('AC-1: User Model', () => {
    it('should have user registration endpoint', async () => {
      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Test User',
          email: `test-${Date.now()}@example.com`,
          password: 'testpassword123',
        }),
      });

      expect([200, 201, 400, 409]).toContain(response.status);
    });

    it('should have login endpoint', async () => {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123',
        }),
      });

      expect([200, 401]).toContain(response.status);
    });
  });

  describe('AC-2: Protected Routes', () => {
    it('should require authentication for tasks', async () => {
      const response = await fetch(`${API_BASE}/api/tasks`);
      
      expect([401, 403]).toContain(response.status);
    });

    it('should return 401 for unauthenticated requests', async () => {
      const response = await fetch(`${API_BASE}/api/tasks`, {
        headers: {
          'Authorization': 'Bearer invalid-token',
        },
      });

      expect([401, 403]).toContain(response.status);
    });
  });
});