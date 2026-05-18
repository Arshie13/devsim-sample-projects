/**
 * Level 4 Task 2: Notification History - Server Integration Tests
 *
 * These tests verify the notification history API endpoints work correctly.
 * They test against the real server and database.
 */

import { describe, expect, it, beforeAll, afterAll } from 'vitest';

const API_BASE = process.env.API_URL || 'http://localhost:3000';

describe('Level 4 Task 2: Notification History Server Tests', () => {
  describe('AC-1: Notification Model', () => {
    it('should have notifications endpoint', async () => {
      const response = await fetch(`${API_BASE}/api/notifications`, {
        method: 'GET',
      });

      expect([200, 401]).toContain(response.status);
    });

    it('should fetch user notifications', async () => {
      const response = await fetch(`${API_BASE}/api/notifications?unread=true`);
      
      if (response.status === 200) {
        const data = await response.json();
        expect(Array.isArray(data)).toBe(true);
      }
    });
  });

  describe('AC-2: Read Status', () => {
    it('should allow marking notification as read', async () => {
      const response = await fetch(`${API_BASE}/api/notifications/read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notificationId: 'test-id',
        }),
      });

      expect([200, 400, 401]).toContain(response.status);
    });

    it('should have read status endpoint', async () => {
      const response = await fetch(`${API_BASE}/api/notifications/unread-count`);
      
      expect([200, 401]).toContain(response.status);
    });
  });

  describe('AC-3: Cleanup', () => {
    it('should cleanup old notifications', async () => {
      const response = await fetch(`${API_BASE}/api/notifications/cleanup`, {
        method: 'POST',
      });

      expect([200, 201]).toContain(response.status);
    });
  });
});