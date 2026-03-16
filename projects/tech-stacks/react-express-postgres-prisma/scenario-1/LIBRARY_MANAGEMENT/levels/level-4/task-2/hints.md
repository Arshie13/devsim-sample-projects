# Hints

## Hint 1: Define Overdue Clearly
Overdue means due date is in the past and item is not returned.

## Hint 1.1: Keep It Separate from Task-1 Filters
Treat `Overdue` as its own filter option, not as part of task-1's borrowed/returned-only scope.

## Hint 2: Share Types
Use shared TypeScript types so frontend and backend agree on overdue fields.

## Hint 3: Compute Once
Use one helper for overdue-day calculations to keep output consistent.
