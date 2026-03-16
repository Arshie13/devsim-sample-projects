# Acceptance Criteria

## AC-1: Backend Data Support
- [ ] `server/src/routes/borrow.routes.ts` exposes data needed by overdue filtering in borrow records
- [ ] Response includes fields required to determine currently overdue records

## AC-2: Overdue Filter in Borrow Records
- [ ] `client/src/pages/BorrowRecords.tsx` supports filtering records by overdue status
- [ ] Filtered rows show book details, borrower name, and days overdue
- [ ] Overdue view is implemented inside Borrow Records (no separate overdue page)
