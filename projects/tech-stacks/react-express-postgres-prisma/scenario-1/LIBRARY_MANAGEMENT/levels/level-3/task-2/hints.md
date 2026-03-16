# Hints

## Hint 1: Prisma Transactions
Wrap related writes in `prisma.$transaction(...)` so return updates are all-or-nothing.

## Hint 2: Guard Conditions
Protect inventory updates with a safe condition (for example, conditional update) so concurrent borrow requests cannot underflow stock.

## Hint 3: Verify with Stress Cases
Focus on `server/src/controllers/borrow.controller.ts` and validate behavior with concurrent borrow requests and return-write failure scenarios.
