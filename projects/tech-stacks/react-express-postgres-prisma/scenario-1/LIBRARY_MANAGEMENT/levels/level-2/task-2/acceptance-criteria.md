# Acceptance Criteria

## AC-1: Helper Extraction
- [ ] Availability logic is moved out of inline page code in `BorrowRecords.tsx`
- [ ] Helper is implemented in `client/src/utils/helpers.ts`
- [ ] Helper is exported with function name `isBookAvailable`
- [ ] Helper accepts available-copy count and returns availability as a boolean
- [ ] `BorrowRecords.tsx` uses the helper for availability filtering (implementation style can vary)
- [ ] Function/file-name mismatch is considered a failed submission
- [ ] Validation is outcome-based and allows different coding styles, as long as requirements are met

## AC-2: Behavior Preservation
- [ ] Borrow/Issue behavior remains correct after refactor
- [ ] Only books with available copies are selectable in Issue Book flow after refactor
- [ ] No regressions appear in related components using borrow flow
- [ ] Tests should verify behavior/contract, not enforce one exact line-by-line implementation
