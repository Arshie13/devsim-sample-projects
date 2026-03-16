# User Stories

## Story 1: Fix Borrow Availability Bug
As a developer,
I want a reusable availability helper,
So that borrow decisions stay correct and consistent.

**Acceptance:**
- [ ] `isBookAvailable(availableCopies)` is exported from `client/src/utils/helpers.ts`
- [ ] Inputs with `availableCopies <= 0` return `false`
- [ ] Inputs with `availableCopies > 0` return `true`
- [ ] Repeated checks with the same input return consistent output
