# User Stories

## Story 1: Fix Borrow Availability Bug
As a library member,
I want to borrow a book whenever copies are available,
So that I am not blocked by incorrect availability logic.

**Acceptance:**
- [ ] Books with `availableCopies = 0` cannot be borrowed
- [ ] Books with `availableCopies >= 1` can be borrowed
- [ ] Borrow button state matches availability consistently
