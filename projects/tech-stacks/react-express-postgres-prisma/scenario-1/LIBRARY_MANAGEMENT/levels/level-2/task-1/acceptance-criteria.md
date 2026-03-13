# Acceptance Criteria

## AC-1: Correct Availability Condition
- [ ] Logic in `client/src/pages/BookDetails.tsx` uses `availableCopies <= 0` for unavailable state
- [ ] Off-by-one behavior is removed

## AC-2: Borrow Button Behavior
- [ ] Borrow button is disabled only when no copies are available
- [ ] Borrow button is enabled when one or more copies are available
