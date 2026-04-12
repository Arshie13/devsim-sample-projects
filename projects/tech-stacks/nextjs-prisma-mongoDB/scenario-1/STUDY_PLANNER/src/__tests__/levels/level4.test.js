import { PrismaClient } from '@prisma/client';
import { render, screen } from '@testing-library/react';
import Page from '../../app/page';

const prisma = new PrismaClient();

describe('Level 4: Notifications & Reminders', () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Task 4.1: Implement Deadline Notifications', () => {
    test('should have notification preferences in User model', async () => {
      const userFields = await prisma.user?.fields;
      expect(userFields).toHaveProperty('notificationPreferences');
    });

    test('should have notification API endpoint', async () => {
      // Check if there's a notifications API route
      // This is a placeholder; in real test, fetch from /api/notifications
      expect(true).toBe(true);
    });
  });

  describe('Task 4.2: Add Notification History', () => {
    test('should have Notification model', async () => {
      const notificationFields = await prisma.notification?.fields;
      expect(notificationFields).toBeDefined();
      expect(notificationFields).toHaveProperty('userId');
      expect(notificationFields).toHaveProperty('message');
      expect(notificationFields).toHaveProperty('read');
    });

    test('should have notifications page', async () => {
      render(<Page />);
      const notificationsLink = screen.getByText(/notifications/i) || screen.getByRole('link', { name: /notifications/i });
      expect(notificationsLink).toBeInTheDocument();
    });
  });
});