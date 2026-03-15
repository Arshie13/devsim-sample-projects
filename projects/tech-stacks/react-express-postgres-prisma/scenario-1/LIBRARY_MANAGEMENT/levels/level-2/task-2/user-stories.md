# User Stories

## Story 1: Reuse Availability Logic
As a developer,
I want BorrowRecords to use the shared availability helper,
So that the logic stays consistent across views.

**Acceptance:**
- [ ] Availability filtering in `BorrowRecords.tsx` uses `isBookAvailable` from `client/src/utils/helpers.ts`
- [ ] Existing borrow page behavior remains correct after refactor
- [ ] Helper output determines which books are selectable in the Issue Book flow
- [ ] Multiple valid implementations are allowed; evaluation focuses on behavior and contract, not exact line-by-line code
