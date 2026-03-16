/**
 * Level 4 Task 1: Borrow Records - Client Unit Contract Tests
 *
 * These tests are output-oriented and intentionally fail on starter code.
 * They verify the required implementation contract directly in real source files,
 * with no runtime mocks.
 */

import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

const readBorrowRecordsPage = async () =>
  readFile(new URL('../../../../client/src/pages/BorrowRecords.tsx', import.meta.url), 'utf8');

const readLibraryService = async () =>
  readFile(new URL('../../../../client/src/services/libraryService.ts', import.meta.url), 'utf8');

describe('Level 4 Task 1: Borrow Records Client Contracts', () => {
  describe('AC-1: History Endpoint Contract', () => {
    it('should keep Borrow Records wired to the real borrow history endpoint', async () => {
      const serviceCode = await readLibraryService();

      expect(serviceCode).toMatch(/async\s+getAllBorrowRecords\s*\(/);
      expect(serviceCode).toMatch(/request<\s*BorrowRecord\[\]\s*>\(\s*['"]\/borrow-records['"]/);
    });
  });

  describe('AC-2: Status Filtering Contract', () => {
    it('should support status query forwarding for ALL, BORROWED, and RETURNED', async () => {
      const serviceCode = await readLibraryService();

      expect(serviceCode).toMatch(/getAllBorrowRecords\s*\(\s*status\s*:\s*['"]ALL['"]\s*\|\s*['"]BORROWED['"]\s*\|\s*['"]RETURNED['"]/);
      expect(serviceCode).toMatch(/\?status=\$\{status\}/);
    });
  });

  describe('AC-3: Borrow Records Filter Output', () => {
    it('should render All Statuses, Borrowed, and Returned filter options with empty-state output', async () => {
      const pageCode = await readBorrowRecordsPage();

      expect(pageCode).toMatch(/All Statuses/);
      expect(pageCode).toMatch(/<option\s+value=['"]BORROWED['"]>\s*Borrowed\s*<\/option>/);
      expect(pageCode).toMatch(/<option\s+value=['"]RETURNED['"]>\s*Returned\s*<\/option>/);
      expect(pageCode).toMatch(/No records found\./);
    });
  });

  describe('AC-4: Row Status and Action Output', () => {
    it('should render distinct Borrowed and Returned labels and return button only for BORROWED', async () => {
      const pageCode = await readBorrowRecordsPage();

      expect(pageCode).toMatch(/Borrowed/);
      expect(pageCode).toMatch(/Returned/);
      expect(pageCode).toMatch(/r\.status\s*===\s*['"]BORROWED['"]/);
    });
  });

  describe('Edge Cases', () => {
    it('should avoid collapsing every non-returned row into a Borrowed label', async () => {
      const pageCode = await readBorrowRecordsPage();

      expect(pageCode.match(/r\.status\s*===\s*['"]RETURNED['"]\s*\?[^:]+:\s*\(/s)).toBeNull();
    });

    it('should validate unsupported status values before issuing a request', async () => {
      const serviceCode = await readLibraryService();

      expect(serviceCode).toMatch(/throw\s+new\s+Error\(['"]Invalid status filter['"]\)/);
    });
  });
});
