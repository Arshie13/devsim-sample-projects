# User Stories

## Story 1: Enforce Transaction Safety
As a platform engineer,
I want borrow and return updates to run atomically,
So that concurrent requests cannot corrupt inventory counts.

**Acceptance:**
- [ ] Borrow and return operations are wrapped in transactions
- [ ] Concurrent operations do not create negative stock
- [ ] Failure in one step rolls back the whole operation
