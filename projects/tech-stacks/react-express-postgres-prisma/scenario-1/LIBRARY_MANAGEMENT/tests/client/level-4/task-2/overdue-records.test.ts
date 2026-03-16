/**
 * Level 4 Task 2: Overdue Records - Client Contract Tests
 *
 * Output-oriented checks against real implementation files.
 * No runtime mocks are used.
 */

import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

const readBorrowRecordsPage = async () =>
	readFile(new URL('../../../../client/src/pages/BorrowRecords.tsx', import.meta.url), 'utf8');

const readLibraryService = async () =>
	readFile(new URL('../../../../client/src/services/libraryService.ts', import.meta.url), 'utf8');

describe('Level 4 Task 2: Overdue Records Client Contracts', () => {
	describe('AC-1: Backend Data Support Wiring', () => {
		it('should request overdue rows using a dedicated OVERDUE filter contract', async () => {
			const serviceCode = await readLibraryService();

			expect(serviceCode).toMatch(/getAllBorrowRecords\s*\(\s*status\s*:\s*['"]ALL['"]\s*\|\s*['"]BORROWED['"]\s*\|\s*['"]RETURNED['"]\s*\|\s*['"]OVERDUE['"]/);
			expect(serviceCode).toMatch(/\?status=\$\{status\}/);
		});

		it('should provide an overdue-day output helper for consistent UI formatting', async () => {
			const pageCode = await readBorrowRecordsPage();

			expect(pageCode).toMatch(/function\s+calculateDaysOverdue\s*\(/);
			expect(pageCode).toMatch(/Math\.(floor|ceil|round)\(/);
		});
	});

	describe('AC-2: Overdue Filter in Borrow Records', () => {
		it('should render a dedicated Overdue filter option in Borrow Records page', async () => {
			const pageCode = await readBorrowRecordsPage();

			expect(pageCode).toMatch(/<option\s+value=['"]OVERDUE['"]>\s*Overdue\s*<\/option>/);
		});

		it('should render overdue rows with borrower, book, and days overdue output columns', async () => {
			const pageCode = await readBorrowRecordsPage();

			expect(pageCode).toMatch(/Borrower/);
			expect(pageCode).toMatch(/Book/);
			expect(pageCode).toMatch(/Days Overdue/);
			expect(pageCode).toMatch(/daysOverdue|calculateDaysOverdue/);
		});
	});

	describe('Edge Cases', () => {
		it('should keep overdue filter separate from borrowed and returned options', async () => {
			const pageCode = await readBorrowRecordsPage();

			expect(pageCode).toMatch(/<option\s+value=['"]BORROWED['"]>\s*Borrowed\s*<\/option>/);
			expect(pageCode).toMatch(/<option\s+value=['"]RETURNED['"]>\s*Returned\s*<\/option>/);
			expect(pageCode).toMatch(/<option\s+value=['"]OVERDUE['"]>\s*Overdue\s*<\/option>/);
		});

		it('should show No records found for empty overdue result state', async () => {
			const pageCode = await readBorrowRecordsPage();

			expect(pageCode).toMatch(/No records found\./);
		});
	});
});
