# Hints

## Hint 1: Use Prisma Transactions
Wrap related writes in `prisma.$transaction(...)` so return updates are all-or-nothing. This ensures that if any operation fails, all changes are rolled back.

## Hint 2: Add Guard Conditions
Protect inventory updates with a safe condition. For example, use a conditional update so that concurrent borrow requests cannot cause stock to go negative.

## Hint 3: Test Concurrent Scenarios
Focus on `server/src/controllers/borrow.controller.ts` and validate behavior with concurrent borrow requests and return-write failure scenarios.
