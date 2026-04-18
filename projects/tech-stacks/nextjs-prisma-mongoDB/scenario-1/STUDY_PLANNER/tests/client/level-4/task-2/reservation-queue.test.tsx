/**
 * Level 4 Task 2: Notification History - Client Unit Contract Tests
 *
 * These tests are output-oriented and intentionally fail on starter code.
 * They verify the required implementation contract directly in real source files.
 */

import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

const readPrismaSchema = async () =>
  readFile('../../../../prisma/schema.prisma', 'utf8');

const readNotificationsPage = async () =>
  readFile('../../../../src/app/notifications/page.tsx', 'utf8');

describe('Level 4 Task 2: Notification History Client Contracts', () => {
  describe('AC-1: Notification Model', () => {
    it('should define Notification model in schema', async () => {
      const schemaCode = await readPrismaSchema();

      expect(schemaCode).toMatch(/model\s+Notification/);
      expect(schemaCode).toMatch(/userId|message|type|readStatus|createdAt/i);
    });

    it('should have read status field', async () => {
      const schemaCode = await readPrismaSchema();

      expect(schemaCode).toMatch(/read|readAt|isRead/i);
    });
  });

  describe('AC-2: Notifications Page', () => {
    it('should have notifications page component', async () => {
      const pageCode = await readNotificationsPage();

      expect(pageCode).toMatch(/notification|Notification/i);
    });

    it('should display notification list', async () => {
      const pageCode = await readNotificationsPage();

      expect(pageCode).toMatch(/map.*notification|forEach.*notification/i);
    });
  });

  describe('AC-3: Read Status', () => {
    it('should allow marking notifications as read', async () => {
      const pageCode = await readNotificationsPage();

      expect(pageCode).toMatch(/mark.*read|read.*true|setRead/i);
    });

    it('should show unread indicator', async () => {
      const pageCode = await readNotificationsPage();

      expect(pageCode).toMatch(/unread|badge|count/i);
    });
  });
});

describe('Level 4 Task 2: Hidden Contract Guards', () => {
  it('should handle empty notifications list', async () => {
    const pageCode = await readNotificationsPage();

    expect(pageCode).toMatch(/empty|no.*notification/i);
  });

  it('should have cleanup for old notifications', async () => {
    const schemaCode = await readPrismaSchema();

    expect(schemaCode).toMatch(/delete.*older|cleanup.*30/i);
  });
});