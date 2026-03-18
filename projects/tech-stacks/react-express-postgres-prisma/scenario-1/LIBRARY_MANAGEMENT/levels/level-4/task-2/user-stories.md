# User Stories

## Story 1: Fulfill and Manage Reservation Lifecycle
As a librarian,
I want reservation fulfillment and cancellation to update queue order automatically,
So that members always see accurate reservation status and position.

**Acceptance:**
- [ ] Return flow promotes the first queued reservation to `READY_FOR_PICKUP`
- [ ] Reservation cancellation updates queue positions consistently
- [ ] Member-facing reservation view reflects `RESERVED`, `READY_FOR_PICKUP`, and `CANCELLED`
