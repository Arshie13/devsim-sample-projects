# Acceptance Criteria

## AC-1: Reservation Create Contract
- [ ] `POST /api/reservations` returns HTTP `201` with `{ success: true, data: Reservation }` for valid requests
- [ ] Request body includes `bookId` and `memberId`
- [ ] Reservation create is allowed only when target book has `availableCopies === 0`
- [ ] Duplicate active reservation for the same member and book returns HTTP `400`
- [ ] Required implementation names are exact and case-sensitive:
  - `createReservation` in `server/src/controllers/reservation.controller.ts`
  - `createReservation` in `client/src/services/libraryService.ts`
  - Route path is `/api/reservations` in `server/src/routes/reservation.routes.ts`

## AC-2: Reservation Queue Read Contract
- [ ] `GET /api/reservations?bookId=<id>` returns HTTP `200` with `{ success: true, data: ReservationQueueRow[] }`
- [ ] Each queue row includes `id`, `bookId`, `memberId`, `queuePosition`, `status`, `createdAt`
- [ ] Each queue row includes display-ready relation data: `member.name` and `book.title`
- [ ] Queue response is ordered by `queuePosition` ascending

## AC-3: Client Reserve Entry Point
- [ ] `client/src/pages/Books.tsx` renders `Reserve Book` only when `availableCopies` is `0`
- [ ] Borrow action stays primary when `availableCopies` is greater than `0`
- [ ] Reserve action triggers `createReservation(...)` from `client/src/services/libraryService.ts`
- [ ] Reservation errors (book available, duplicate reservation, invalid member) are shown in UI

## AC-4: Queue Position and Success Output
- [ ] After successful reservation, UI confirms queue position (for example: `You are #3 in line.`)
- [ ] Queue length and position display are based on backend response, not hard-coded client math
- [ ] Empty queue state for a book displays `No active reservations.`
