# Hints

## Hint 1: Keep One Source of Truth for Status Filters
Define allowed query values (`ALL`, `BORROWED`, `RETURNED`) in one place and map them to Prisma conditions.

## Hint 2: Keep Task Scope Strict
Limit task-1 filtering to `BORROWED` and `RETURNED`. Move any `OVERDUE`-specific behavior to task-2.

## Hint 3: Return Display-Ready Relations
Ensure borrow-record results include `book` plus `member`/`walkInBorrower` so Borrow Records can render names without extra requests.

## Hint 4: Keep Frontend Filter Semantics Equal to Backend
If backend supports `BORROWED` and `RETURNED`, frontend filter options and row rendering should match exactly.
