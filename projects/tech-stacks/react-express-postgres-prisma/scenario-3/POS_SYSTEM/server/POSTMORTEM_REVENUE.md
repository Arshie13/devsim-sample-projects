# Postmortem: Inflated Revenue on Daily Sales Report

## Symptom

Finance raised a ticket: the **Reports page's total revenue** on the POS did not match
the physical cash drawer at end-of-day, consistently **overstating** sales. The
inflation tracked, on each affected day, the total value of orders that cashiers had
voided earlier in the same shift. As a result, end-of-day close-outs could not be
reconciled and the books could not be closed.

## Root Cause

The revenue aggregation in `GET /api/orders/reports/daily` and related dashboard/stats
queries summed `order.total` across **all orders in the date range**, without filtering
out voided orders.

Worse, any refactor that tried to filter by `status !== 'VOIDED'` would still be wrong:
an admin user with DB-edit rights (or any buggy code path that flips the enum) can set
`status` back to `COMPLETED` while the authoritative cancellation record — the
`voidedAt` timestamp — is still populated. Because `status` is mutable and enum-shaped
while `voidedAt` is write-once when the void transaction runs, **the timestamp is the
single source of truth** for whether an order contributes to revenue.

Put simply:

- `status` answers: "what state is the row in *right now*?"
- `voidedAt` answers: "has this order ever been voided?"

For financial reporting we need the second question.

## Fix

1. Replaced status-based predicates in every revenue aggregation with
   `voidedAt: null` — see [server/src/routes/orders.ts](server/src/routes/orders.ts)
   (`GET /reports/daily`, `GET /stats`).
2. Centralized the predicate into
   [server/src/utils/revenueUtils.ts](server/src/utils/revenueUtils.ts), exporting:
   - `isRevenueEligibleOrder(order)` — in-memory guard for iteration/filtering.
   - `revenueWhereClause(extra?)` — returns a Prisma `where` partial that callers
     spread into `findMany`/`aggregate`.
3. Added regression tests under
   `tests/server/level-5/task-1/revenue-classification.test.ts` and
   `tests/server/level-5/task-2/revenue-fix.test.ts` that explicitly cover the
   **stale-status** scenario: an order with `status = 'COMPLETED'` but
   `voidedAt != null` must be **excluded** from revenue.

## Prevention

- All revenue-eligible queries must now go through `revenueWhereClause()` or
  `isRevenueEligibleOrder()`. Reviewers should reject any new PR that checks
  `status === 'COMPLETED'` as a substitute for the revenue predicate.
- The revenue predicate has a dedicated unit test that asserts stale-status rows
  are excluded; this test must never be weakened to pass a failing implementation.
- Document in the Order model comment (and developer onboarding) that `voidedAt`
  is the source-of-truth column for cancellation; `status` is a UI/workflow hint.
