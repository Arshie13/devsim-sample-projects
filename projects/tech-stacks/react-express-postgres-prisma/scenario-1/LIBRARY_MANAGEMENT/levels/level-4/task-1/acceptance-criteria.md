# Acceptance Criteria

## AC-1: History Endpoint Contract
- [ ] `GET /api/borrow-records` returns HTTP `200` with `{ success: true, data: BorrowRecord[] }`
- [ ] Each row includes: `id`, `bookId`, `borrowerType`, `status`, `borrowedAt`, `dueDate`, `returnedAt`
- [ ] Each row includes related display data: `book.title` and borrower identity (`member.name` or `walkInBorrower.name`)
- [ ] Required implementation names are exact and case-sensitive:
	- `getAllBorrowRecords` in `client/src/services/libraryService.ts`
	- `getAllBorrowRecords` in `server/src/controllers/borrow.controller.ts`
	- Route path remains `/api/borrow-records` in `server/src/routes/borrow.routes.ts`

## AC-2: Status Filtering Contract
- [ ] `GET /api/borrow-records?status=BORROWED` returns only rows with status `BORROWED`
- [ ] `GET /api/borrow-records?status=RETURNED` returns only rows with status `RETURNED`
- [ ] `GET /api/borrow-records` (or `status=ALL`) returns both active and returned history rows
- [ ] Invalid `status` query values return HTTP `400`

## AC-3: Borrow Records Filter Output
- [ ] `client/src/pages/BorrowRecords.tsx` renders filter options for `All Statuses`, `Borrowed`, and `Returned`
- [ ] Selecting `Borrowed` shows only `BORROWED` rows
- [ ] Selecting `Returned` shows only `RETURNED` rows
- [ ] When filtered results are empty, UI displays `No records found.`
- [ ] Borrow Records page calls `getAllBorrowRecords(...)` from `client/src/services/libraryService.ts` (exact name and casing)

## AC-4: Row Status/Action Output
- [ ] Status cells render distinct labels for `Borrowed` and `Returned`
- [ ] Return action is shown only for rows with status `BORROWED`
- [ ] Rows stay ordered by most recent `borrowedAt` first
