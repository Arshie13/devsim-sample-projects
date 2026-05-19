# POS System – Developer Challenge Levels

Welcome to NOVO Enterprises! You've joined the team maintaining our Point-of-Sale
system, built with **Next.js**, **PostgreSQL** and **Prisma**. The five levels
below ramp from a gentle environment warm-up to a master-level reporting sweep.

Each task ships with a graded test under `tests/level-N/task-M/`. A task is
complete when its test passes:

```bash
npm run test:tasks:l2      # run every task in Level 2
npm run test:task:l2:t1    # run a single task
```

> **Grading rule:** every test fails on the starter code and passes once you
> finish the task. Tests grade pure helper functions you create under
> `src/lib/` — wiring them into the UI is part of the task but the function
> itself is what's scored.

---

## 🎮 Level 1: Environment Setup & Orientation
**Difficulty: ⭐ Easy** · **Estimated Time: 20–30 min**

### Scenario
You just cloned the repo. Get the POS running against your own PostgreSQL
database, then make one small change to confirm you know where things live.

### Task 1.1 — Environment Setup
1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env` and set `DATABASE_URL` to **your own**
   PostgreSQL connection string (your local Postgres user/password/database).
3. Create the schema and generate the client: `npm run prisma:migrate`
4. Load the sample data: `npm run prisma:seed`
5. Start the app: `npm run dev`

**Graded by** `tests/level-1/task-1/setup-check.test.tsx`, which installs-checks,
runs `prisma migrate deploy`, runs a `SELECT 1` + seed-row smoke query via
`scripts/db-check.ts`, and boots the dev server. Your Postgres password is never
read by the test — it only runs your configured environment.

### Task 1.2 — Peso Formatting Helper
Create [`src/lib/format.ts`](src/lib/format.ts) exporting:
```ts
export function formatPeso(amount: number): string
```
- Prefixes `₱`, always shows 2 decimals, uses comma thousands separators
  (`1234.5` → `"₱1,234.50"`).
- Negative amounts put the sign first: `-5` → `"-₱5.00"`.

Then use `formatPeso` for the price displays in the POS and Inventory pages.

### Success Criteria
- [ ] `npm run dev` works against your own database
- [ ] Schema migrated and seed data inserted
- [ ] `formatPeso` exported and used in the UI

---

## 🎮 Level 2: Inventory Quality
**Difficulty: ⭐⭐ Medium** · **Estimated Time: 1–1.5 hrs**

### Task 2.1 — Stock Status Helper
Create [`src/lib/inventory.ts`](src/lib/inventory.ts) exporting:
```ts
export function getStockStatus(quantity: number): 'OUT_OF_STOCK' | 'LOW_STOCK' | 'IN_STOCK'
```
- `quantity <= 0` → `'OUT_OF_STOCK'`
- `1`–`5` inclusive → `'LOW_STOCK'`
- `> 5` → `'IN_STOCK'`

Show a coloured stock badge on the Inventory page driven by this helper.

### Task 2.2 — Cart Totals Helper
Create [`src/lib/cart.ts`](src/lib/cart.ts) exporting:
```ts
export function calculateCartTotals(
  items: { price: number; cartQuantity: number }[],
  discountPercent?: number,
): { subtotal: number; discount: number; total: number }
```
- `subtotal` = Σ `price × cartQuantity`
- `discount` = `subtotal × discountPercent / 100` (0 when no percent given)
- `total` = `subtotal − discount`
- All three rounded to 2 decimals.

Drive the POS cart summary with this helper.

### Success Criteria
- [ ] `getStockStatus` classifies all three bands correctly
- [ ] `calculateCartTotals` handles the empty cart and the coupon case
- [ ] Both helpers are wired into the UI

---

## 🎮 Level 3: Checkout Integrity
**Difficulty: ⭐⭐⭐ Hard** · **Estimated Time: 2–3 hrs**

### Task 3.1 — Checkout Validation
Create [`src/lib/checkout.ts`](src/lib/checkout.ts) exporting:
```ts
export function validateCheckout(
  cart: { product_id: string; cartQuantity: number }[],
  products: { product_id: string; quantity: number }[],
): { ok: boolean; errors: string[] }
```
- Empty cart → an error.
- A line with `cartQuantity <= 0` → an error.
- A line whose quantity exceeds available stock → an error mentioning the
  `product_id`.
- A line whose product is not in `products` → an error.
- `ok` is `true` only when `errors` is empty.

### Task 3.2 — Order Payload Builder
Add to the same file:
```ts
export function buildOrderPayload(
  cart: { product_id: string; price: number; cartQuantity: number }[],
  customerName: string,
  coupon?: { coupon_id: string; discount_percent: number },
): { customer_name: string; total_amount: number; discount_amount: number;
     coupon_id: string | null; items: {
       product_id: string; quantity: number; unit_price: number; subtotal: number;
     }[] }
```
- One `items` entry per cart line, with `subtotal = price × cartQuantity`.
- `discount_amount` from the coupon percent (0 with no coupon).
- `total_amount = subtotal − discount_amount`; `coupon_id` is `null` with no coupon.

Use both helpers in the POS checkout flow so totals are computed consistently.

### Success Criteria
- [ ] `validateCheckout` rejects empty carts, oversells, bad quantities, unknown products
- [ ] `buildOrderPayload` produces a server-ready order body
- [ ] POS checkout uses both helpers

---

## 🎮 Level 4: Coupons Feature Expansion
**Difficulty: ⭐⭐⭐⭐ Expert** · **Estimated Time: 2.5–3.5 hrs**

### Task 4.1 — Coupon Normalization & Validity
Create [`src/lib/coupon.ts`](src/lib/coupon.ts) exporting:
```ts
export function normalizeCode(raw: string): string
export function isCouponValid(
  coupon: { is_active: boolean; expires_at?: string | null },
  now: Date,
): boolean
```
- `normalizeCode` trims, uppercases, and removes internal whitespace
  (`"  save 10 "` → `"SAVE10"`).
- `isCouponValid` is `true` only when the coupon is active **and** either has no
  `expires_at` or `expires_at` is in the future relative to `now`.

Add an optional `expires_at DateTime?` field to the `Coupon` model in
`prisma/schema.prisma` and migrate.

### Task 4.2 — Best Coupon Selector
Add to the same file:
```ts
export function applyBestCoupon(
  subtotal: number,
  coupons: { coupon_id: string; discount_percent: number;
             is_active: boolean; expires_at?: string | null }[],
  now: Date,
): { coupon: ...; discount: number } | null
```
- Considers only coupons that pass `isCouponValid`.
- Returns the valid coupon that yields the **largest** discount, plus that
  discount amount. Returns `null` when none are valid.

### Success Criteria
- [ ] `Coupon.expires_at` added and migrated
- [ ] `normalizeCode` and `isCouponValid` behave as specified
- [ ] `applyBestCoupon` ignores invalid coupons and maximises the discount

---

## 🎮 Level 5: Sales Reporting
**Difficulty: ⭐⭐⭐⭐⭐ Master** · **Estimated Time: 3–4 hrs**

### Task 5.1 — Sales Summary
Create [`src/lib/reports.ts`](src/lib/reports.ts) exporting:
```ts
export function summarizeSales(
  orders: { total_amount: number; discount_amount: number }[],
): { totalRevenue: number; totalDiscount: number;
     orderCount: number; averageOrderValue: number }
```
- Sum revenue and discount; count orders.
- `averageOrderValue = totalRevenue / orderCount`, rounded to 2 decimals,
  `0` when there are no orders (no division by zero).

### Task 5.2 — Top Selling Products
Add to the same file:
```ts
export function topSellingProducts(
  items: { product_id: string; product_name: string;
           quantity: number; subtotal: number }[],
  limit: number,
): { product_id: string; product_name: string;
     unitsSold: number; revenue: number }[]
```
- Aggregate by `product_id`: `unitsSold` = Σ quantity, `revenue` = Σ subtotal.
- Sort by `unitsSold` descending, breaking ties by `revenue` descending.
- Return the first `limit` entries.

Build a `/admin/reports` page that surfaces both aggregates.

### Success Criteria
- [ ] `summarizeSales` totals correctly and is safe for zero orders
- [ ] `topSellingProducts` aggregates, sorts, tie-breaks, and respects `limit`
- [ ] A reports page renders both

---

## 🏆 Scoring

| Level | Points |
|-------|--------|
| Level 1 | 10 pts |
| Level 2 | 25 pts |
| Level 3 | 45 pts |
| Level 4 | 65 pts |
| Level 5 | 80 pts |

**Bonus:** +20 pts for clean code and helpers actually wired into the UI.
**Total:** 225 pts + bonus

---

## 📚 Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Vitest Documentation](https://vitest.dev/)

*Good luck, developer! 🛒*
