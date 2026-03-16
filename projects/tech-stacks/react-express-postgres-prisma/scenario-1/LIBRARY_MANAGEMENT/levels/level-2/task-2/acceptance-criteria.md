# Acceptance Criteria

## AC-1: Helper Adoption in Borrow Flow
- [ ] `BorrowRecords.tsx` uses `isBookAvailable` from `client/src/utils/helpers.ts` for availability filtering
- [ ] Inline availability checks in `BorrowRecords.tsx` are replaced by helper usage
- [ ] Availability filtering follows helper output, even when helper logic changes
- [ ] Validation is outcome-based and allows different coding styles, as long as requirements are met

## AC-2: Behavior Preservation
- [ ] Borrow/Issue behavior remains correct after refactor
- [ ] Only books with available copies are selectable in Issue Book flow after refactor
- [ ] No regressions appear in related components using borrow flow
- [ ] Tests should verify behavior/contract, not enforce one exact line-by-line implementation
