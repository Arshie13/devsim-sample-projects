# Hints

## Hint 1: Start from Return Flow
Inspect `server/src/controllers/borrow.controller.ts` in `returnBook` and trace the full write path.

## Hint 2: Verify Prisma Write Sequence
Check whether borrow record update and book copy update are split across separate Prisma calls.

## Hint 3: Capture Root Cause Evidence
Reproduce the failure path where one write can succeed while another fails, then document the exact sequence and why it can leave inconsistent state.
