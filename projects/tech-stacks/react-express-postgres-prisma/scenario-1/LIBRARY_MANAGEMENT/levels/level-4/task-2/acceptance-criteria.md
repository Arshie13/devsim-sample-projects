# Acceptance Criteria

## AC-1: Return Flow Reservation Fulfillment
- [ ] In `returnBook` flow, when a returned book has active reservations and stock becomes available, first queue entry is updated to `READY_FOR_PICKUP`
- [ ] Queue progression updates happen in the same transactional boundary as return updates
- [ ] Required implementation names are exact and case-sensitive:
  - `returnBook` in `server/src/controllers/borrow.controller.ts`
  - `promoteNextReservation` in `server/src/controllers/reservation.controller.ts`

## AC-2: Reservation Cancellation Contract
- [ ] `DELETE /api/reservations/:id` (or equivalent cancel endpoint) marks reservation as `CANCELLED`
- [ ] Cancellation triggers queue reindex so remaining active reservations have continuous positions (`1..n`)
- [ ] Cancelling an already cancelled or fulfilled reservation returns HTTP `400`
- [ ] Required implementation names are exact and case-sensitive:
  - `cancelReservation` in `server/src/controllers/reservation.controller.ts`
  - `cancelReservation` in `client/src/services/libraryService.ts`

## AC-3: Member Reservation Status View
- [ ] Client provides a reservation list view for the member showing `book.title`, `queuePosition`, and `status`
- [ ] Rows with `READY_FOR_PICKUP` are visually distinct from `RESERVED`
- [ ] Empty state displays `No reservations found.`

## AC-4: Fulfillment/Cancellation UI Feedback
- [ ] On successful cancellation, UI confirms: `Reservation cancelled.`
- [ ] On queue updates, affected members see updated position values from backend response
- [ ] UI never computes lifecycle status from local assumptions; it uses server status output
