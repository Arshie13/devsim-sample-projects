# Hints

## Hint 1: Trust Source-of-Truth Fields
Use `returnedAt` and `dueDate` as primary decision fields instead of relying on status alone.

## Hint 2: Guard Against Stale Status
Returned records may still carry `BORROWED` or `OVERDUE`; overdue output should still stay correct.

## Hint 3: Use Deterministic UTC Fixtures
Use fixed UTC timestamps around midnight to make boundary behavior reproducible.
