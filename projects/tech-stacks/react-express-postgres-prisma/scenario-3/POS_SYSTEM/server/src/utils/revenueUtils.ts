/**
 * Revenue-eligibility helpers.
 *
 * The source-of-truth for "did this sale really happen" is `voidedAt`, NOT the
 * mutable `status` field. An admin can flip status back to COMPLETED while
 * voidedAt still holds the cancellation timestamp — that order must still be
 * excluded from revenue. See POSTMORTEM_REVENUE.md for the full story.
 */

export type RevenueEligibleOrder = {
  voidedAt: Date | null;
  status?: string;
};

export function isRevenueEligibleOrder(order: RevenueEligibleOrder): boolean {
  return order.voidedAt === null || order.voidedAt === undefined;
}

/**
 * Prisma where-clause builder for revenue queries. Use this instead of
 * scattering `{ voidedAt: null }` throughout the codebase.
 */
export function revenueWhereClause(extra: Record<string, unknown> = {}) {
  return {
    voidedAt: null,
    ...extra,
  };
}
