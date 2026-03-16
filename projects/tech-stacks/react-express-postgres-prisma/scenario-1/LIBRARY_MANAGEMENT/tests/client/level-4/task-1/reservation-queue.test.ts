/**
 * Level 4 Task 1: Reservation Queue Foundation - Client Unit Contract Tests
 *
 * These tests are output-oriented and intentionally fail on starter code.
 * They verify the required implementation contract directly in real source files,
 * with no runtime mocks.
 */

import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

const readBooksPage = async () =>
  readFile('src/pages/Books.tsx', 'utf8');

const readLibraryService = async () =>
  readFile('src/services/libraryService.ts', 'utf8');

describe('Level 4 Task 1: Reservation Queue Foundation Client Contracts', () => {
  describe('AC-1: Reservation Create Contract', () => {
    it('should define createReservation in library service and target /reservations endpoint', async () => {
      const serviceCode = await readLibraryService();

      expect(serviceCode).toMatch(/async\s+createReservation\s*\(/);
      expect(serviceCode).toMatch(/createReservation\s*\(\s*bookId\s*[:,][\s\S]*memberId\s*[:,]/);
      expect(serviceCode).toMatch(/['"]\/reservations['"]/);
    });
  });

  describe('AC-2: Reservation Queue Read Contract', () => {
    it('should define getReservationQueue and pass bookId query to the API', async () => {
      const serviceCode = await readLibraryService();

      expect(serviceCode).toMatch(/async\s+getReservationQueue\s*\(/);
      expect(serviceCode).toMatch(/getReservationQueue\s*\(\s*bookId\s*[:,]/);
      expect(serviceCode).toMatch(/\?bookId=\$\{bookId\}/);
    });
  });

  describe('AC-3: Client Reserve Entry Point', () => {
    it('should expose Reserve Book output and availableCopies guard in Books page', async () => {
      const pageCode = await readBooksPage();

      expect(pageCode).toMatch(/Reserve Book/);
      expect(pageCode).toMatch(/availableCopies\s*===\s*0|0\s*===\s*availableCopies/);
      expect(pageCode).toMatch(/createReservation\s*\(/);
    });
  });

  describe('AC-4: Queue Position and Success Output', () => {
    it('should include output for queue position confirmation and empty queue state', async () => {
      const pageCode = await readBooksPage();

      expect(pageCode).toMatch(/You are\s*#|in line|queue position/i);
      expect(pageCode).toMatch(/No active reservations\./);
    });
  });

  describe('Edge Cases', () => {
    it('should include duplicate reservation feedback text in output', async () => {
      const serviceCode = await readLibraryService();

      expect(serviceCode).toMatch(/already reserved|duplicate reservation|already has an active reservation/i);
    });
  });
});
