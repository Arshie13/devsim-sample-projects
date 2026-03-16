# Hints

## Hint 1: Model the Reservation Lifecycle
Use explicit reservation states (`RESERVED`, `READY_FOR_PICKUP`, `CANCELLED`) and transition between them intentionally.

## Hint 1.1: Keep Queue Mutations Transactional
Promotion and queue reindex should happen inside one transactional operation to avoid race conditions.

## Hint 2: Centralize Queue Reindex Logic
Put queue position recalculation in one server helper so return flow and cancellation reuse the same behavior.

## Hint 3: Use Backend as Source of Truth
Client should render reservation status and position from API responses rather than deriving them locally.
