import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import path from 'path';

const ROOT = path.resolve(__dirname, '../../../..');
const ORDERS_ROUTE = path.resolve(ROOT, 'server/src/routes/orders.ts');

describe('L5T1: Revenue Classification Bug — Stats Endpoint Must Exclude Cancelled Orders', () => {
  it('GET /api/orders/stats route exists in orders.ts', () => {
    const content = readFileSync(ORDERS_ROUTE, 'utf-8');
    expect(content).toMatch(/\/stats/);
    expect(content).toMatch(/router\.get\s*\(\s*['"]\/stats['"]/);
  });

  it('Stats endpoint WHERE clause filters by cancelledAt: null (source-of-truth field)', () => {
    const content = readFileSync(ORDERS_ROUTE, 'utf-8');
    // Must use cancelledAt: null — NOT status-based filtering for revenue
    expect(content).toMatch(/cancelledAt\s*:\s*null/);
  });

  it('Stats endpoint does NOT rely solely on status === CANCELLED for revenue exclusion', () => {
    const content = readFileSync(ORDERS_ROUTE, 'utf-8');
    // A stale PENDING order with cancelledAt set should still be excluded
    // Source-of-truth filter (cancelledAt: null) is required
    // If the only filter is status, this is the bug
    const statsSection = content.match(/\/stats[\s\S]*?(?=router\.|$)/)?.[0] ?? '';
    // If CANCELLED is the only filter (no cancelledAt), the bug still exists
    const usesOnlyStatusFilter =
      /status.*CANCELLED/.test(statsSection) && !/cancelledAt/.test(statsSection);
    expect(usesOnlyStatusFilter).toBe(false);
  });

  it('Revenue calculation sums only non-cancelled orders', () => {
    const content = readFileSync(ORDERS_ROUTE, 'utf-8');
    // Both the filter and the aggregation should be present
    expect(content).toMatch(/reduce.*total|total.*reduce|sum.*total/i);
    expect(content).toMatch(/cancelledAt\s*:\s*null/);
  });

  it('Stale-status scenario: order with status=PENDING but cancelledAt set must be excluded', () => {
    // This test verifies the source-of-truth approach is documented/referenced.
    // The stats query must filter by cancelledAt IS NULL, not just by status != CANCELLED.
    const content = readFileSync(ORDERS_ROUTE, 'utf-8');
    expect(content).toMatch(/cancelledAt\s*:\s*null/);
    // Should NOT have a comment saying only status-based filtering is enough
    expect(content).not.toMatch(/status.*!.*CANCELLED.*only/i);
  });
});
