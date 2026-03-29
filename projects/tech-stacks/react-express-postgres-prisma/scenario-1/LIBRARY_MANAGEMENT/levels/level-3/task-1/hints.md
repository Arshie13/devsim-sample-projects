# Hints

## Hint 1: Start from Return Flow
Inspect `server/src/controllers/borrow.controller.ts` in the `returnBook` function and trace the full write path. Look for how the borrow record update and book copy update are handled.

## Hint 2: Verify Prisma Write Sequence
Check whether the borrow record update and book copy update are split across separate Prisma calls. This could lead to inconsistent state if one succeeds but the other fails.

## Hint 3: Capture Root Cause Evidence
Reproduce the failure path where one write can succeed while another fails. Document the exact sequence and explain why it can leave the database in an inconsistent state.
