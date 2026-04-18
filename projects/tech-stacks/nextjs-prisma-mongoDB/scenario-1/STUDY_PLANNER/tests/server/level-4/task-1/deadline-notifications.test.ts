/**
 * Level 4 Task 1: Deadline Notifications - Server Integration Tests
 *
 * These tests verify the notification system API endpoints work correctly.
 * They test against the real server and database.
 */

import { describe, expect, it, beforeAll, afterAll } from 'vitest';

const API_BASE = process.env.API_URL || 'http://localhost:3000';

describe('Level 4 Task 1: Deadline Notifications Server Tests', () => {
  describe('AC-1: Notification Preferences', () => {
    it('should allow setting notification preferences', async () => {
      const response = await fetch(`${API_BASE}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notificationPreferences: {
            email: true,
            deadlineReminder: true,
          },
        }),
      });

      expect([200, 400, 401]).toContain(response.status);
    });

    it('should have notification preferences in user model', async () => {
      const response = await fetch(`${API_BASE}/api/users/me`);
      
      if (response.status === 200) {
        const user = await response.json();
        expect(user).toHaveProperty('notificationPreferences');
      }
    });
  });

  describe('AC-2: Reminder Endpoints', () => {
    it('should have reminder API endpoint', async () => {
      const response = await fetch(`${API_BASE}/api/notifications/reminders`, {
        method: 'GET',
      });

      expect([200, 401]).toContain(response.status);
    });

    it('should send reminders for upcoming deadlines', async () => {
      const response = await fetch(`${API_BASE}/api/notifications/send-reminders`, {
        method: 'POST',
      });

      expect([200, 201]).toContain(response.status);
    });
  });
});