# Hints

## Hint 1: Keep Reservation Eligibility Explicit
Reservation creation should pass only when book copies are `0`. Validate this on the server before insert.

## Hint 2: Assign Queue Position Server-Side
Compute `queuePosition` in backend create flow so client stays presentation-only.

## Hint 3: Return Display-Ready Queue Rows
Include `member` and `book` relation fields needed by UI in the queue response.

## Hint 4: Keep Task-1 Scope Strict
Task-1 is only reservation creation and queue visibility. Fulfillment and cancellation belong to task-2.
