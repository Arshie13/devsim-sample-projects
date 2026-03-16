# User Stories

## Story 1: Enforce Transaction Safety
As a backend engineer,
I want the borrow and return flows in `server/src/controllers/borrow.controller.ts` to run atomically,
So that concurrent requests cannot corrupt `availableCopies` and partial writes are never persisted.

**Acceptance:**
- [ ] Borrow and return operations are wrapped in transactions
- [ ] Concurrent operations do not create negative stock
- [ ] Failure in one step rolls back the whole operation
