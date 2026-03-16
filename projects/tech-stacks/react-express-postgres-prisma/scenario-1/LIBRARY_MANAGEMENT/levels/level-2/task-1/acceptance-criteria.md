# Acceptance Criteria

## AC-1: Availability Helper Contract
- [ ] A helper is implemented and exported as `isBookAvailable` from `client/src/utils/helpers.ts`
- [ ] The helper returns `false` when `availableCopies <= 0`
- [ ] The helper returns `true` when `availableCopies > 0`

## AC-2: Borrow Decision Consistency
- [ ] Borrow-availability decisions remain consistent for mixed copy counts (positive, zero, negative)
- [ ] Repeated calls with the same input return the same output
- [ ] Tests validate behavior and contract rather than enforcing one exact implementation style
