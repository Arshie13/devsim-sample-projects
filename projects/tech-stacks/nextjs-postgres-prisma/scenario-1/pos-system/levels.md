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
> finish the task. Each level mixes the kinds of tests you'll see in a real
> Next.js codebase — **server tests** (mocked Prisma server actions) and
> **client tests** (React components rendered with Testing Library).

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

## 🎮 Level 2: Inventory Quality (Server)
**Difficulty: ⭐⭐ Medium** · **Estimated Time: 1–1.5 hrs**

Both tasks at this level are **server actions** backed by Prisma. The graders
mock `@/lib/prisma`, so you write real Prisma queries — no DB calls actually
execute in the test.

### Task 2.1 — Stock Status (Server Action)
Create [`src/app/actions/inventory.ts`](src/app/actions/inventory.ts) exporting:
```ts
export async function getStockStatusForProduct(productId: string): Promise<{
  productId: string;
  quantity: number;
  status: 'OUT_OF_STOCK' | 'LOW_STOCK' | 'IN_STOCK';
}>
```
- Use `prisma.product.findUnique({ where: { product_id: productId } })`.
- Throw when the product does not exist.
- Classify the quantity: `<= 0` → `OUT_OF_STOCK`, `1–5` → `LOW_STOCK`,
  `> 5` → `IN_STOCK`.

### Task 2.2 — Cart Totals (Server Action)
Create [`src/app/actions/cart.ts`](src/app/actions/cart.ts) exporting:
```ts
export async function getCartTotals(input: {
  items: { product_id: string; cartQuantity: number }[];
  discountPercent?: number;
}): Promise<{ subtotal: number; discount: number; total: number }>
```
- Fetch prices via `prisma.product.findMany({ where: { product_id: { in: [...] } } })`.
- `subtotal` = Σ `price × cartQuantity` using DB prices.
- `discount` = `subtotal × discountPercent / 100` (0 when not given).
- `total` = `subtotal − discount`. All three rounded to 2 decimals.
- Empty `items` → return zeroes without querying Prisma.

### Success Criteria
- [ ] Both server actions live under `src/app/actions/`
- [ ] Each one queries Prisma (the test mocks the client, not your code)
- [ ] Money values are rounded to two decimals

---

## 🎮 Level 3: Checkout Integrity (Client)
**Difficulty: ⭐⭐⭐ Hard** · **Estimated Time: 2–3 hrs**

Both tasks at this level are **React components**. The graders use
`@testing-library/react` to render the component in jsdom and assert on
its rendered output.

### Task 3.1 — Checkout Errors Banner
Create [`src/components/CheckoutErrors.tsx`](src/components/CheckoutErrors.tsx)
with a default-exported component:
```tsx
export default function CheckoutErrors({ errors }: { errors: string[] }): JSX.Element
```
- When `errors` is empty, render a status banner (`role="status"`) saying
  the cart is "Ready to checkout".
- Otherwise render an alert (`role="alert"`) with a `<ul>` containing one
  `<li>` per error message.

### Task 3.2 — Order Summary
Create [`src/components/OrderSummary.tsx`](src/components/OrderSummary.tsx)
with a default-exported component:
```tsx
export default function OrderSummary(props: {
  customerName: string;
  items: { product_id: string; product_name: string; price: number; cartQuantity: number }[];
  coupon?: { coupon_id: string; code: string; discount_percent: number };
}): JSX.Element
```
- Show the customer name (`data-testid="customer-name"`).
- Render one row per item (`data-testid="order-item"`) with the product name
  and the line subtotal in `₱X.XX` format.
- Show the total (`data-testid="order-total"`). When a coupon is supplied,
  also show the discount (`data-testid="order-discount"`).

### Success Criteria
- [ ] Both components live under `src/components/`
- [ ] Each renders the documented `role`s / `data-testid`s
- [ ] Money values use the `₱X.XX` format from Level 1

---

## 🎮 Level 4: Coupons Feature Expansion (Mixed)
**Difficulty: ⭐⭐⭐⭐ Expert** · **Estimated Time: 2.5–3.5 hrs**

This level mixes one **client component** (Task 4.1) with one **server action**
(Task 4.2). You'll also need to add `expires_at` to the `Coupon` model in
`prisma/schema.prisma` and migrate.

### Task 4.1 — Coupon Input (Client)
Create [`src/components/CouponInput.tsx`](src/components/CouponInput.tsx)
with a default-exported component:
```tsx
export default function CouponInput({ onApply }: {
  onApply: (normalizedCode: string) => void;
}): JSX.Element
```
- Render a text input (`role="textbox"`, placeholder containing "coupon")
  and an "Apply" button.
- On Apply, call `onApply` with the normalized code: trimmed, uppercased,
  with internal whitespace removed (`"  save 10 "` → `"SAVE10"`).
- The button must be disabled when the input is empty / whitespace-only.
- Clear the input after a successful apply.

### Task 4.2 — Best Coupon Selector (Server Action)
Create [`src/app/actions/coupons.ts`](src/app/actions/coupons.ts) exporting:
```ts
export async function applyBestCoupon(subtotal: number, now?: Date): Promise<{
  coupon: { coupon_id: string; code: string; discount_percent: number };
  discount: number;
} | null>
```
- Query Prisma for active coupons (`prisma.coupon.findMany({ where: { is_active: true } })`).
- Ignore coupons whose `expires_at` is in the past (relative to `now`,
  defaulting to `new Date()`).
- Return the coupon yielding the **largest** discount on `subtotal`, plus the
  discount amount. Return `null` when none qualify.

### Success Criteria
- [ ] `Coupon.expires_at` added and migrated
- [ ] `<CouponInput />` normalizes input and disables Apply for empty values
- [ ] `applyBestCoupon` queries active coupons and picks the largest valid discount

---

## 🎮 Level 5: Sales Reporting (Mixed)
**Difficulty: ⭐⭐⭐⭐⭐ Master** · **Estimated Time: 3–4 hrs**

This level mixes one **client component** (Task 5.1) with one **server action**
(Task 5.2). Build a `/admin/reports` page that surfaces both.

### Task 5.1 — Sales Summary (Client)
Create [`src/components/SalesSummary.tsx`](src/components/SalesSummary.tsx)
with a default-exported component:
```tsx
export default function SalesSummary({ orders }: {
  orders: { total_amount: number; discount_amount: number }[];
}): JSX.Element
```
- `data-testid="total-revenue"` — Σ `total_amount`, peso-formatted.
- `data-testid="total-discount"` — Σ `discount_amount`, peso-formatted.
- `data-testid="order-count"` — number of orders.
- `data-testid="average-order"` — `totalRevenue / orderCount`, rounded 2dp
  (0 when there are no orders, no division by zero), peso-formatted.

### Task 5.2 — Top Selling Products (Server Action)
Create [`src/app/actions/reports.ts`](src/app/actions/reports.ts) exporting:
```ts
export async function getTopSellingProducts(limit: number): Promise<{
  product_id: string;
  product_name: string;
  unitsSold: number;
  revenue: number;
}[]>
```
- Query `prisma.orderItem.findMany({ include: { product: true } })`.
- Aggregate by `product_id`: `unitsSold` = Σ quantity, `revenue` = Σ subtotal,
  `product_name` from the related product.
- Sort by `unitsSold` descending, breaking ties by `revenue` descending.
- Return the first `limit` entries.

### Success Criteria
- [ ] `<SalesSummary />` totals correctly and is safe for zero orders
- [ ] `getTopSellingProducts` aggregates, sorts, tie-breaks, and respects `limit`
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
