# ONLINE_ENTERPRISE — DevSim Cheatsheet (Instructor Reference)

> **DO NOT share with students.** This file contains complete solutions for every task.
> Run tests: `npm test` (all) or `npm run test:task:l{N}:t{M}` per task.

---

## Level 1 — Getting Familiar with the Codebase

### L1T1: Prepare Development Environment

```bash
# From ONLINE_ENTERPRISE root
npm install

# Install client dependencies
cd client && npm install && cd ..

# Install server dependencies
cd server && npm install && cd ..

# Create server/.env
echo 'DATABASE_URL="postgresql://postgres:password@localhost:5432/urbanpottery"' > server/.env
echo 'JWT_SECRET="devsim-secret-key-change-in-production"' >> server/.env
echo 'PORT=5000' >> server/.env

# Apply Prisma schema to the database
cd server && npx prisma migrate dev --name init && cd ..

# Start both servers (two terminals)
# Terminal 1:
cd server && npm run dev
# Terminal 2:
cd client && npm run dev
```

**Tests pass when:** `client/node_modules`, `server/node_modules`, and `server/node_modules/.prisma` all exist.

---

### L1T2: Update Brand Identity in Navbar

**File:** `client/src/components/layout/Navbar.tsx`

**Change line 48** from:
```tsx
<span className="text-xl font-bold text-warm-900">UrbanPottery</span>
```
to:
```tsx
<span className="text-xl font-bold text-warm-900">UrbanPottery Artisan Ceramics</span>
```

**Test command:** `npm run test:task:l1:t2`

---

## Level 2 — Client-Side Exploration

### L2T1: Add Stock Status Classifier Helper

**File:** `client/src/utils/formatters.ts` — append at the bottom:

```typescript
export type StockStatus = 'OUT_OF_STOCK' | 'LOW_STOCK' | 'IN_STOCK';

export const getStockStatus = (stock: number): StockStatus => {
  if (stock <= 0) return 'OUT_OF_STOCK';
  if (stock <= 5) return 'LOW_STOCK';
  return 'IN_STOCK';
};
```

Also re-export from `client/src/utils/index.ts`:
```typescript
export { getStockStatus } from './formatters';
// (add this alongside the existing exports)
```

**Test command:** `npm run test:task:l2:t1`

---

### L2T2: Adopt Stock Helper in ProductCard & Shop Filter

#### ProductCard.tsx — full refactored version of the stock logic section

**File:** `client/src/components/ProductCard.tsx`

Replace the top import line to include getStockStatus:
```typescript
import { formatCurrency, getStockStatus } from '../utils';
```

Replace lines 16–17:
```typescript
// BEFORE:
const isOutOfStock = product.stock === 0;
const isLowStock = product.stock > 0 && product.stock <= 5;

// AFTER:
const stockStatus = getStockStatus(product.stock);
const isOutOfStock = stockStatus === 'OUT_OF_STOCK';
const isLowStock = stockStatus === 'LOW_STOCK';
```

#### Shop.tsx — add the hide-out-of-stock toggle

**File:** `client/src/pages/Shop.tsx`

1. Add import at top:
```typescript
import { getStockStatus } from '../utils';
```

2. Add state after existing state declarations:
```typescript
const [hideOutOfStock, setHideOutOfStock] = useState(false);
```

3. Update `filteredProducts` filter to include the toggle:
```typescript
const filteredProducts = products
  .filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || product.categoryId === selectedCategory;
    const matchesStock = !hideOutOfStock || getStockStatus(product.stock) !== 'OUT_OF_STOCK';
    return matchesSearch && matchesCategory && matchesStock;
  })
  .sort(/* existing sort */);
```

4. Add toggle UI inside the filter card (after the dropdowns `<div>`):
```tsx
{/* Hide out-of-stock toggle */}
<div className="flex items-center gap-2 mt-4">
  <input
    type="checkbox"
    id="hideOutOfStock"
    checked={hideOutOfStock}
    onChange={(e) => setHideOutOfStock(e.target.checked)}
    className="w-4 h-4 accent-primary-600"
  />
  <label htmlFor="hideOutOfStock" className="text-sm font-medium text-warm-700 cursor-pointer">
    Hide out-of-stock
  </label>
</div>
```

**Test command:** `npm run test:task:l2:t2`

---

## Level 3 — Backend Debugging & Transactional Consistency

### L3T1: Diagnose Cancelled-Order Stock Leak

**What to document:** The PATCH `/api/orders/:id/status` handler in `server/src/routes/orders.ts` only calls `prisma.order.update({ data: { status } })`. It never queries `OrderItem` records or calls `product.update({ stock: { increment } })`. Stock remains reduced after cancellation.

**Required deliverable:** Create `server/src/controllers/order.controller.ts` with an initial `cancelOrder` stub that references `cancelledAt`:

```typescript
// server/src/controllers/order.controller.ts
import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma.js';
import { createError } from '../middleware/errorHandler.js';

// L3T1 Diagnosis: PATCH /orders/:id/status only flips status — it does NOT:
//   1. Restore Product.stock for each OrderItem (stock leak)
//   2. Set cancelledAt timestamp (no audit trail)
//   3. Guard against concurrent oversell at checkout
// This function is the fix (implemented fully in L3T2).

export async function cancelOrder(req: Request, res: Response, next: NextFunction) {
  // Full implementation in L3T2
  // Will set cancelledAt and restore stock atomically
  next(createError(501, 'cancelOrder not yet implemented'));
}
```

Also add `cancelledAt` to Prisma schema (see L3T2 for full schema change).

**Test command:** `npm run test:task:l3:t1`

---

### L3T2: Atomic Order Cancellation + Concurrency Guard

#### Step 1 — Update Prisma schema

**File:** `server/prisma/schema.prisma` — add `cancelledAt` to the `Order` model:

```prisma
model Order {
  id          String      @id @default(uuid())
  user        User        @relation(fields: [userId], references: [id])
  userId      String
  status      OrderStatus @default(PENDING)
  total       Float
  address     String
  cancelledAt DateTime?                          // ← ADD THIS LINE
  items       OrderItem[]
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
}
```

Then run:
```bash
cd server && npx prisma migrate dev --name add-cancelled-at
```

#### Step 2 — Implement cancelOrder

**File:** `server/src/controllers/order.controller.ts`

```typescript
import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma.js';
import { createError } from '../middleware/errorHandler.js';
import { AuthRequest } from '../middleware/auth.js';

export async function cancelOrder(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const existing = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!existing) throw createError(404, 'Order not found');

    if (existing.userId !== req.user!.id && req.user!.role !== 'ADMIN') {
      throw createError(403, 'Access denied');
    }

    if (!['PENDING', 'PROCESSING'].includes(existing.status)) {
      throw createError(400, `Cannot cancel an order with status: ${existing.status}`);
    }

    const order = await prisma.$transaction(async (tx) => {
      // 1. Flip status and set cancelledAt
      const updated = await tx.order.update({
        where: { id },
        data: {
          status: 'CANCELLED',
          cancelledAt: new Date(),
        },
      });

      // 2. Restore stock for each item
      for (const item of existing.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }

      return updated;
    });

    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
}
```

#### Step 3 — Wire cancelOrder into orders.ts

**File:** `server/src/routes/orders.ts` — add at the top:
```typescript
import { cancelOrder } from '../controllers/order.controller.js';
```

Add a new route (before `export default router`):
```typescript
// POST /api/orders/:id/cancel - Cancel an order and restore stock
router.post('/:id/cancel', authenticate, cancelOrder);
```

#### Step 4 — Concurrency guard at checkout

**File:** `server/src/routes/orders.ts` — inside the `POST /` handler, replace the individual `product.update` decrement loop with `updateMany` + guard:

```typescript
// Replace inside the $transaction:
for (const item of data.items) {
  const updated = await tx.product.updateMany({
    where: {
      id: item.productId,
      stock: { gte: item.quantity },  // guard: only update if enough stock
    },
    data: { stock: { decrement: item.quantity } },
  });

  if (updated.count === 0) {
    const product = productMap.get(item.productId)!;
    throw createError(400, `Insufficient stock for ${product.name}`);
  }
}
```

**Test command:** `npm run test:task:l3:t2`

---

## Level 4 — Full-Stack Feature: Coupon / Discount Codes

### L4T1: Validate & Apply Coupon at Checkout

#### Step 1 — Add Coupon model to schema

**File:** `server/prisma/schema.prisma`

```prisma
model Coupon {
  id              String   @id @default(uuid())
  code            String   @unique
  discountPercent Float
  maxUses         Int
  usedCount       Int      @default(0)
  expiresAt       DateTime
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

Run: `cd server && npx prisma migrate dev --name add-coupon-model`

#### Step 2 — Create coupon controller

**File:** `server/src/controllers/coupon.controller.ts`

```typescript
import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma.js';
import { createError } from '../middleware/errorHandler.js';

export async function validateCoupon(req: Request, res: Response, next: NextFunction) {
  try {
    const { code, subtotal } = req.body;

    if (!code || typeof subtotal !== 'number') {
      throw createError(400, 'code and subtotal are required');
    }

    const coupon = await prisma.coupon.findUnique({ where: { code } });

    if (!coupon || !coupon.isActive) {
      throw createError(400, 'Invalid coupon code');
    }
    if (coupon.expiresAt < new Date()) {
      throw createError(400, 'Coupon has expired');
    }
    if (coupon.usedCount >= coupon.maxUses) {
      throw createError(400, 'Coupon has been fully redeemed');
    }

    const discount = (subtotal * coupon.discountPercent) / 100;
    const finalTotal = subtotal - discount;

    res.json({
      success: true,
      data: { discountPercent: coupon.discountPercent, discount, finalTotal },
    });
  } catch (error) {
    next(error);
  }
}

export async function listCoupons(req: Request, res: Response, next: NextFunction) {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: coupons });
  } catch (error) {
    next(error);
  }
}
```

#### Step 3 — Create coupons route

**File:** `server/src/routes/coupons.ts`

```typescript
import { Router } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { validateCoupon, listCoupons } from '../controllers/coupon.controller.js';

const router = Router();

// POST /api/coupons/validate
router.post('/validate', validateCoupon);

// GET /api/coupons — admin only
router.get('/', authenticate, requireAdmin, listCoupons);

export default router;
```

Register in `server/src/routes/index.ts`:
```typescript
import couponsRouter from './coupons.js';
// ...
router.use('/coupons', couponsRouter);
```

#### Step 4 — Extend POST /api/orders to accept couponCode

**File:** `server/src/routes/orders.ts`

Add `couponCode` to the Zod schema:
```typescript
const createOrderSchema = z.object({
  address: z.string().min(10, 'Address must be at least 10 characters'),
  items: z.array(orderItemSchema).min(1, 'Order must have at least one item'),
  couponCode: z.string().optional(),  // ← ADD
});
```

Inside the `$transaction`, after calculating `total`, add coupon logic:
```typescript
let appliedCouponId: string | null = null;
let discountAmount = 0;

if (data.couponCode) {
  const coupon = await tx.coupon.findUnique({ where: { code: data.couponCode } });
  if (!coupon || !coupon.isActive || coupon.expiresAt < new Date() || coupon.usedCount >= coupon.maxUses) {
    throw createError(400, 'Invalid or expired coupon');
  }
  discountAmount = (total * coupon.discountPercent) / 100;
  total = total - discountAmount;
  appliedCouponId = coupon.id;

  await tx.coupon.update({
    where: { id: coupon.id },
    data: { usedCount: { increment: 1 } },
  });
}
```

#### Step 5 — Create couponService.ts on the client

**File:** `client/src/services/couponService.ts`

```typescript
import api from './api';

export interface CouponValidationResult {
  discountPercent: number;
  discount: number;
  finalTotal: number;
}

export async function validateCoupon(
  code: string,
  subtotal: number
): Promise<CouponValidationResult> {
  const response = await api.post('/api/coupons/validate', { code, subtotal });
  return response.data.data;
}
```

Add to `client/src/services/index.ts`:
```typescript
export * from './couponService';
```

#### Step 6 — Add coupon UI to Checkout.tsx

Add state inside Checkout component:
```typescript
const [couponCode, setCouponCode] = useState('');
const [couponStatus, setCouponStatus] = useState<'idle' | 'applied' | 'invalid' | 'expired' | 'exhausted'>('idle');
const [discountAmount, setDiscountAmount] = useState(0);
const [discountPercent, setDiscountPercent] = useState(0);
```

Add handler:
```typescript
const handleApplyCoupon = async () => {
  if (!couponCode.trim()) return;
  try {
    const result = await validateCoupon(couponCode.trim(), total);
    setDiscountAmount(result.discount);
    setDiscountPercent(result.discountPercent);
    setCouponStatus('applied');
    toast.success(`Coupon applied! ${result.discountPercent}% off`);
  } catch (err: any) {
    const msg: string = err?.response?.data?.message ?? '';
    if (msg.includes('expired')) setCouponStatus('expired');
    else if (msg.includes('redeemed')) setCouponStatus('exhausted');
    else setCouponStatus('invalid');
    setDiscountAmount(0);
    setDiscountPercent(0);
  }
};
```

Add UI before the totals section:
```tsx
{/* Coupon Code */}
<div className="border-t border-warm-100 pt-6 mb-4">
  <p className="text-sm font-medium text-warm-700 mb-2">Coupon Code</p>
  <div className="flex gap-2">
    <input
      type="text"
      value={couponCode}
      onChange={(e) => setCouponCode(e.target.value)}
      placeholder="Enter code"
      className="flex-1 border border-warm-200 rounded-lg px-3 py-2 text-sm"
    />
    <button
      type="button"
      onClick={handleApplyCoupon}
      className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700"
    >
      Apply
    </button>
  </div>
  {couponStatus === 'applied' && (
    <p className="text-green-600 text-sm mt-1">{discountPercent}% discount applied!</p>
  )}
  {couponStatus === 'invalid' && <p className="text-red-500 text-sm mt-1">Invalid coupon code.</p>}
  {couponStatus === 'expired' && <p className="text-red-500 text-sm mt-1">This coupon has expired.</p>}
  {couponStatus === 'exhausted' && <p className="text-red-500 text-sm mt-1">This coupon has been fully redeemed.</p>}
</div>
```

Update totals to show discount:
```tsx
{discountAmount > 0 && (
  <div className="flex justify-between text-green-600">
    <span>Discount ({discountPercent}%)</span>
    <span>-{formatCurrency(discountAmount)}</span>
  </div>
)}
```

**Test command:** `npm run test:task:l4:t1`

---

### L4T2: Coupon Lifecycle + Usage Integrity

#### Step 1 — Atomic usedCount guard in coupon.controller.ts

Update `validateCoupon` to also work as an atomic inline validator inside the order transaction. Add a separate `consumeCoupon` helper:

```typescript
// Add to coupon.controller.ts
export async function consumeCouponInTransaction(
  tx: any,
  couponId: string
): Promise<void> {
  const result = await tx.coupon.updateMany({
    where: { id: couponId, usedCount: { lt: tx.coupon.maxUses } },
    data: { usedCount: { increment: 1 } },
  });
  if (result.count === 0) {
    throw new Error('Coupon exhausted (concurrent request race)');
  }
}
```

Update the validation checks to be explicit about all three guards:
```typescript
// In validateCoupon — enforce all three:
if (!coupon.isActive) throw createError(400, 'Coupon is inactive');
if (coupon.expiresAt < new Date()) throw createError(400, 'Coupon has expired');
if (coupon.usedCount >= coupon.maxUses) throw createError(400, 'Coupon exhausted');
```

#### Step 2 — cancelOrder decrements usedCount

**File:** `server/src/controllers/order.controller.ts`

Add coupon decrement inside the `$transaction`:
```typescript
// After restoring stock, inside the $transaction:
// Also need to store couponId on the order — add couponId field to Order model first
if ((existing as any).couponId) {
  await tx.coupon.update({
    where: { id: (existing as any).couponId },
    data: { usedCount: { decrement: 1 } },
  });
}
```

Add `couponId` to the Order model in schema:
```prisma
model Order {
  // ...existing fields...
  couponId    String?
  // ...
}
```

Run: `npx prisma migrate dev --name add-coupon-id-to-order`

#### Step 3 — Admin coupon panel

**File:** `client/src/pages/admin/Coupons.tsx` (new file) or add to Dashboard.tsx:

```tsx
import { useState, useEffect } from 'react';
import api from '../../services/api';
import { formatDate } from '../../utils';

interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
  usedCount: number;
  maxUses: number;
  expiresAt: string;
  isActive: boolean;
}

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  useEffect(() => {
    api.get('/api/coupons').then((r) => setCoupons(r.data.data));
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Coupon Management</h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2">Code</th>
            <th className="text-left py-2">Discount</th>
            <th className="text-left py-2">Remaining Uses</th>
            <th className="text-left py-2">Expires</th>
            <th className="text-left py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {coupons.map((c) => (
            <tr key={c.id} className="border-b">
              <td className="py-2 font-mono font-bold">{c.code}</td>
              <td className="py-2">{c.discountPercent}%</td>
              <td className="py-2">{c.maxUses - c.usedCount} / {c.maxUses}</td>
              <td className="py-2">{formatDate(c.expiresAt)}</td>
              <td className="py-2">
                <span className={c.isActive ? 'text-green-600' : 'text-red-500'}>
                  {c.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminCoupons;
```

**Test command:** `npm run test:task:l4:t2`

---

## Level 5 — The Production Struggle: Sales Revenue Bug

### L5T1: Stabilize Revenue Classification

**File:** `server/src/routes/orders.ts`

Find the buggy `/stats` handler and replace the empty `where: {}` with:

```typescript
router.get('/stats', authenticate, requireAdmin, async (_req: AuthRequest, res: Response, next) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        cancelledAt: null,  // ← THE FIX: source-of-truth filter
      },
      select: { total: true, status: true },
    });

    const revenue = orders.reduce((sum, order) => sum + order.total, 0);
    const orderCount = orders.length;

    res.json({
      success: true,
      data: { revenue, orderCount },
    });
  } catch (error) {
    next(error);
  }
});
```

**Why `cancelledAt: null` and NOT `status: { not: 'CANCELLED' }`:**
An admin can accidentally change a cancelled order's status back to `PENDING`. `cancelledAt` is set once and never changed — it is the immutable source of truth.

**Test command:** `npm run test:task:l5:t1`

---

### L5T2: Permanent Fix + Centralization + Postmortem

#### Step 1 — Create revenueUtils.ts

**File:** `server/src/utils/revenueUtils.ts`

```typescript
export interface OrderLike {
  cancelledAt: Date | null;
  status: string;
}

/**
 * Returns true if the order should be counted toward revenue.
 * Uses cancelledAt as the source of truth — NOT the status field,
 * because status can be stale (e.g., admin accidentally set a cancelled
 * order back to PENDING).
 */
export function isRevenueEligibleOrder(order: OrderLike): boolean {
  return order.cancelledAt === null;
}

/**
 * Prisma where-clause fragment for revenue-eligible orders.
 * Use this in any query that aggregates revenue.
 */
export const revenueWhereClause = {
  cancelledAt: null,
} as const;
```

#### Step 2 — Use shared utility in orders.ts

```typescript
import { revenueWhereClause } from '../utils/revenueUtils.js';

// In the /stats handler:
const orders = await prisma.order.findMany({
  where: revenueWhereClause,
  select: { total: true, status: true },
});
```

#### Step 3 — Write POSTMORTEM_REVENUE.md

**File:** `server/POSTMORTEM_REVENUE.md`

```markdown
# Postmortem: Inflated Revenue in Admin Dashboard

**Date:** 2026-04-22
**Severity:** High (financial reporting error)
**Resolved:** Yes

## Symptom

Finance reported that the total revenue shown in the admin Dashboard did not
match the sum of non-cancelled orders in the accounting system. The discrepancy
grew over time as more orders were cancelled.

## Root Cause

The `GET /api/orders/stats` endpoint fetched ALL orders with no WHERE filter,
then summed their `total` fields. Cancelled orders were included, inflating the
revenue figure.

A secondary issue compounded this: if an admin accidentally changed a cancelled
order's `status` back to `PENDING`, any status-based filter (`status: { not: 'CANCELLED' }`)
would also include that order — because the `status` field is mutable and can become stale.
Only the `cancelledAt` timestamp, set once at cancellation and never changed, is reliable.

## Fix

1. Added `cancelledAt: null` as the WHERE filter in `/api/orders/stats`.
2. Extracted the predicate into `server/src/utils/revenueUtils.ts` as
   `isRevenueEligibleOrder` and `revenueWhereClause` to prevent future drift
   across multiple report endpoints.
3. Added regression tests covering the stale-status scenario:
   an order with `cancelledAt` set but `status = 'PENDING'` is excluded.

## Prevention

- **Use `cancelledAt` as the source of truth** for all financial queries.
  Never filter revenue by `status` alone.
- **Import `revenueWhereClause`** from `revenueUtils.ts` in any new report
  endpoint — do not inline the filter.
- **The regression test** in `tests/server/level-5/task-2/revenue-fix.test.ts`
  will catch any future regression.
```

**Test command:** `npm run test:task:l5:t2`

---

## Quick Reference: All Test Commands

| Level | Task | Command |
|-------|------|---------|
| 1 | 1 (Setup) | `npm run test:task:l1:t1` |
| 1 | 2 (Navbar brand) | `npm run test:task:l1:t2` |
| 2 | 1 (getStockStatus) | `npm run test:task:l2:t1` |
| 2 | 2 (ProductCard + Shop toggle) | `npm run test:task:l2:t2` |
| 3 | 1 (Diagnose cancel leak) | `npm run test:task:l3:t1` |
| 3 | 2 (Atomic cancel) | `npm run test:task:l3:t2` |
| 4 | 1 (Coupon validate + apply) | `npm run test:task:l4:t1` |
| 4 | 2 (Coupon lifecycle) | `npm run test:task:l4:t2` |
| 5 | 1 (Revenue classification) | `npm run test:task:l5:t1` |
| 5 | 2 (Revenue fix + postmortem) | `npm run test:task:l5:t2` |
| All | — | `npm test` |

## Files Students Must Create (not present in starter code)

| File | Level | Task |
|------|-------|------|
| `server/src/controllers/order.controller.ts` | 3 | 1 & 2 |
| `server/src/controllers/coupon.controller.ts` | 4 | 1 |
| `server/src/routes/coupons.ts` | 4 | 1 |
| `client/src/services/couponService.ts` | 4 | 1 |
| `client/src/pages/admin/Coupons.tsx` | 4 | 2 |
| `server/src/utils/revenueUtils.ts` | 5 | 2 |
| `server/POSTMORTEM_REVENUE.md` | 5 | 2 |

## Files Students Must Modify (present in starter code but broken/incomplete)

| File | Level | Change |
|------|-------|--------|
| `client/src/components/layout/Navbar.tsx` | 1 | Brand string |
| `client/src/utils/formatters.ts` | 2 | Add `getStockStatus` |
| `client/src/components/ProductCard.tsx` | 2 | Use `getStockStatus` |
| `client/src/pages/Shop.tsx` | 2 | Use `getStockStatus` + toggle |
| `server/prisma/schema.prisma` | 3 & 4 | Add `cancelledAt`, `Coupon` model |
| `server/src/routes/orders.ts` | 3 & 5 | Cancel guard + stats filter |
| `client/src/pages/Checkout.tsx` | 4 | Coupon UI |
