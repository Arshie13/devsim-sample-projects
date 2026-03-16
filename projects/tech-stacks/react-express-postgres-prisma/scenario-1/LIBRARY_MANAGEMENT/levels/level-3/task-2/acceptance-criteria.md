# Acceptance Criteria

## AC-1: Atomic Operations
- [ ] Return flow updates (`BorrowRecord` + `Book.availableCopies`) run in one Prisma transaction
- [ ] If one write fails, no partial state is persisted

## AC-2: Concurrency Protection
- [ ] Concurrent borrow requests never reduce `availableCopies` below zero
- [ ] Only valid borrow/return outcomes are committed under concurrent access
