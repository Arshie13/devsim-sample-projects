# Acceptance Criteria

## AC-1: Atomic Operations
- [ ] Related database updates run in a single transaction
- [ ] Partial writes are not persisted on error

## AC-2: Concurrency Protection
- [ ] Stock count never drops below zero under concurrent requests
- [ ] Borrow and return outcomes remain consistent
