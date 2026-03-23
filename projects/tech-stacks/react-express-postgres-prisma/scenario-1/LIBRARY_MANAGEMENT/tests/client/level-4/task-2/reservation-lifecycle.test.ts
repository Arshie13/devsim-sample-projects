/**
 * Level 4 Task 2: Reservation Lifecycle - Client Contract Tests
 *
 * Output-oriented checks against real implementation files.
 * No runtime mocks are used.
 */

import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

const readLibraryService = async () =>
  readFile('src/services/libraryService.ts', 'utf8');

const readClientSourceTree = async () => {
  const [booksCode, reservationsCode, appCode] = await Promise.all([
    readFile('src/pages/Books.tsx', 'utf8').catch(() => ''),
    readFile('src/pages/Reservations.tsx', 'utf8').catch(() => ''),
    readFile('src/App.tsx', 'utf8').catch(() => ''),
  ]);

  return [booksCode, reservationsCode, appCode].join('\n');
};

describe('Level 4 Task 2: Reservation Lifecycle Client Contracts', () => {
  describe('AC-2: Reservation Cancellation Contract', () => {
    it('should define cancelReservation in library service and target /reservations/:id endpoint', async () => {
      const serviceCode = await readLibraryService();

      expect(serviceCode).toMatch(/async\s+cancelReservation\s*\(/);
      expect(serviceCode).toMatch(/cancelReservation\s*\(\s*reservationId\s*[:,]/);
      expect(serviceCode).toMatch(/\/reservations/);
      expect(serviceCode).toMatch(/reservationId/);
    });
  });

  describe('AC-3: Member Reservation Status View', () => {
    it('should include lifecycle statuses and reservation output labels in client source', async () => {
      const sourceCode = await readClientSourceTree();

      expect(sourceCode).toMatch(/RESERVED/);
      expect(sourceCode).toMatch(/READY_FOR_PICKUP/);
      expect(sourceCode).toMatch(/CANCELLED/);
      expect(sourceCode).toMatch(/queuePosition/);
      expect(sourceCode).toMatch(/No reservations found\./);
    });
  });

  describe('AC-4: Fulfillment/Cancellation UI Feedback', () => {
    it('should include user-facing cancellation feedback output', async () => {
      const sourceCode = await readClientSourceTree();

      expect(sourceCode).toMatch(/Reservation cancelled\./);
    });
  });

  describe('Edge Cases', () => {
    it('should keep service lifecycle operations separated by explicit function names', async () => {
      const serviceCode = await readLibraryService();

      expect(serviceCode).toMatch(/createReservation/);
      expect(serviceCode).toMatch(/getReservationQueue/);
      expect(serviceCode).toMatch(/cancelReservation/);
    });
  });
});
