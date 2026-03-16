# Acceptance Criteria

## AC-1: Backend Data Support
- [ ] `server/src/routes/borrow.routes.ts` exposes data needed by overdue filtering in borrow records
- [ ] Response includes fields required to determine currently overdue records (`dueDate`, `returnedAt`, `status`)
- [ ] Backend supports a dedicated overdue filter contract (for example `status=OVERDUE`)
- [ ] Implementation function names used by tests must be exact and case-sensitive:
	- `getAllBorrowRecords` in `server/src/controllers/borrow.controller.ts`
	- Route remains under `/api/borrow-records`

## AC-2: Overdue Filter in Borrow Records
- [ ] `client/src/pages/BorrowRecords.tsx` exposes a separate `Overdue` filter option
- [ ] Filtered rows show book details, borrower name, and days overdue
- [ ] Overdue view is implemented inside Borrow Records (no separate overdue page)
- [ ] Client implementation names used by tests must be exact and case-sensitive:
	- `getAllBorrowRecords(status)` in `client/src/services/libraryService.ts`
	- `calculateDaysOverdue(...)` in `client/src/pages/BorrowRecords.tsx`
	- `status` values include `OVERDUE` as a dedicated option, separate from `BORROWED` and `RETURNED`
