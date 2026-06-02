# POS System — Backend Developer Challenge Levels

Welcome to IPPO Software Solutions! You've been hired as a backend developer assigned to maintain and improve our Point-of-Sale (POS) System API. Complete each level to sharpen your NestJS, Prisma, and PostgreSQL skills — and earn points toward your performance review!

---

## 🎮 Level 1: Environment Setup & Schema Extension
**Difficulty: ⭐ Easy**
**Estimated Time: 30–45 minutes**
**Points: 10**

### Scenario
You just cloned the POS System repository and your team lead needs the API running locally before the sprint kickoff. A quick schema change is also queued: the store owner wants their phone number stored in Settings so it can appear on printed receipts.

### Tasks

#### Task 1.1: Environment Setup
Get the project running locally end-to-end:

1. Install all npm dependencies (`npm install`).
2. Create a `.env` file from `.env.example` and fill in your local `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, and `PORT`.
3. Generate the Prisma client (`npm run prisma:generate`).
4. Run Prisma migrations (`npm run prisma:migrate`).
5. Seed the database with sample data (`npm run prisma:seed`).
6. Start the development server (`npm run start:dev`).
7. Confirm the API responds at `http://localhost:3000/api`.

#### Task 1.2: Add `phoneNumber` to Store Settings
The store owner wants their contact number stored alongside other settings so it prints on receipts.

1. Add an optional `phoneNumber String?` field to the `Setting` model in `prisma/schema.prisma`.
2. Create and run a Prisma migration (`prisma migrate dev --name add-phone-number`).
3. Update the Settings DTO to accept and validate the new field.
4. Update the Settings service so `PUT /api/settings` persists `phoneNumber`.
5. Confirm `GET /api/settings` returns `phoneNumber` in the response.
6. Update the seed script to populate a sample phone number (e.g., `+1-555-0100`).

### Success Criteria
- [ ] `npm run start:dev` starts without errors and the API is reachable.
- [ ] Database migrations run cleanly.
- [ ] Seed data inserts without errors.
- [ ] `POST /api/auth/login` with seeded credentials returns a JWT.
- [ ] `GET /api/settings` includes `phoneNumber` in the response body.
- [ ] `PUT /api/settings` with `{ "phoneNumber": "+1-555-9999" }` persists the value.

---

## 🎮 Level 2: Inventory Integrity & Paginated Products
**Difficulty: ⭐⭐ Medium**
**Estimated Time: 1–2 hours**
**Points: 25**

### Scenario
The warehouse manager filed two bug reports this week. First, the low-stock alert endpoint is returning products that are not actually low on stock — the comparison operator is off by one. Second, cashiers are complaining that the product list takes forever to load because it returns every item in the catalog at once. Fix the bug and add pagination.

### Tasks

#### Task 2.1: Inventory Integrity Guards
Fix the low-stock comparison and prevent stock from going negative.

**Fix low-stock comparison (Bug #INV-001):**
The current query uses `<` instead of `<=` when comparing `quantity` to `lowStock`. A product with `quantity = 10` and `lowStock = 10` should appear in the low-stock list but currently does not.
1. Open `src/inventory/inventory.service.ts` (or equivalent).
2. Change the filter from `quantity < lowStock` to `quantity <= lowStock`.
3. Verify `GET /api/inventory/low-stock` now includes products at the threshold.

**Prevent negative inventory (Bug #INV-002):**
Stock update requests that would result in a negative quantity must be rejected.
1. In the inventory update handler (`PUT /api/inventory/:productId`), validate that the incoming `quantity` value is ≥ 0.
2. If the request would set `quantity` below zero, return `400 Bad Request` with a descriptive message.

#### Task 2.2: Paginated Product Listing
Add `?page=` and `?limit=` query parameters to `GET /api/products`.

1. Accept `page` (default `1`) and `limit` (default `10`) as optional query parameters.
2. Return a paginated envelope:
   ```json
   {
     "data": [...],
     "total": 42,
     "page": 1,
     "limit": 10,
     "totalPages": 5
   }
   ```
3. Ensure the existing `?search=` filter still works alongside pagination.
4. Validate that `page` and `limit` are positive integers; return `400` on invalid values.

### Success Criteria
- [ ] `GET /api/inventory/low-stock` returns a product whose `quantity` equals its `lowStock` threshold.
- [ ] `PUT /api/inventory/:productId` with `quantity: -1` returns `400 Bad Request`.
- [ ] `GET /api/products` without query params returns the paginated envelope.
- [ ] `GET /api/products?page=2&limit=5` returns the correct slice of products.
- [ ] `GET /api/products?search=coffee&page=1` combines search and pagination correctly.

---

## 🎮 Level 3: Transactional Checkout & Payment Validation
**Difficulty: ⭐⭐⭐ Hard**
**Estimated Time: 2–3 hours**
**Points: 40**

### Scenario
The checkout flow has several gaps that are causing real problems at the register. Cashiers are accepting unsupported payment types (causing reconciliation errors), the receipt totals don't match what customers are charged (tax and discount are calculated inconsistently), and a system crash mid-sale left inventory out of sync with orders. You need to harden `POST /api/orders` end-to-end.

### Tasks

#### Task 3.1: Transactional Checkout — Tax, Discount & Inventory Deduction
Make the entire checkout operation atomic and financially correct.

**Tax & discount calculation:**
1. Retrieve the current `Setting` record before processing each order.
2. Apply the store's `taxRate` to the subtotal: `tax = subtotal × (taxRate / 100)`.
3. Accept an optional `discountAmount` (flat value, default `0`) in the request body.
4. Compute: `total = subtotal + tax − discount`.
5. Persist `subtotal`, `tax`, `discount`, and `total` on the `Order` record.

**Atomic inventory deduction:**
1. Wrap order creation and all inventory decrements in a single `prisma.$transaction(...)`.
2. For each item in the order, decrement `inventory.quantity` by the ordered quantity.
3. If any product has insufficient stock (`quantity < ordered`), throw an error and roll back the entire transaction — no order is created, no stock is touched.
4. Verify that a simulated mid-transaction failure rolls back stock correctly.

#### Task 3.2: Payment Method Validation
Only CASH and CARD are supported. Any other value must be rejected before the transaction begins.

1. Add a validation rule (Zod schema or class-validator) to the order creation DTO that restricts `paymentMethod` to the `PaymentMethod` enum values (`CASH`, `CARD`).
2. Return `400 Bad Request` with a clear error message when an unsupported method is supplied.
3. Ensure the `PaymentMethod` enum in the Prisma schema is the single source of truth (do not hardcode strings in service logic).

### Success Criteria
- [ ] `POST /api/orders` with a valid payload creates an order with correct `subtotal`, `tax`, `discount`, and `total`.
- [ ] `tax` on the order equals `subtotal × (taxRate / 100)` from Settings.
- [ ] Inventory quantities are decremented by the ordered amounts after a successful checkout.
- [ ] Checkout with insufficient stock returns `400`/`409` and leaves inventory unchanged.
- [ ] `POST /api/orders` with `paymentMethod: "CRYPTO"` returns `400 Bad Request`.
- [ ] All of the above changes occur inside a single database transaction (atomic).

---

## 🎮 Level 4: Sales Reporting System
**Difficulty: ⭐⭐⭐⭐ Expert**
**Estimated Time: 2–3 hours**
**Points: 60**

### Scenario
Management needs daily and weekly sales dashboards. The `/reports` module exists but returns empty stubs. Implement the aggregations using Prisma and make both endpoints admin-only.

### Tasks

#### Task 4.1: Daily Sales Report
Implement `GET /api/reports/daily` (admin-only).

Return:
```json
{
  "date": "2024-01-15",
  "totalRevenue": 1450.75,
  "orderCount": 23,
  "topProducts": [
    { "productId": "...", "productName": "...", "quantitySold": 12, "revenue": 540.00 }
  ]
}
```

Requirements:
1. Aggregate all orders created today (midnight-to-midnight in UTC).
2. Sum `total` across those orders for `totalRevenue`.
3. Count distinct orders for `orderCount`.
4. Return the top 5 products by `quantitySold`, with each entry including `productId`, `productName`, `quantitySold`, and `revenue`.

#### Task 4.2: Weekly Sales Report
Implement `GET /api/reports/weekly` (admin-only).

Return:
```json
{
  "startDate": "2024-01-09",
  "endDate": "2024-01-15",
  "totalRevenue": 9820.50,
  "totalOrders": 142,
  "dailyBreakdown": [
    { "date": "2024-01-09", "revenue": 1200.00, "orderCount": 18 },
    ...
  ]
}
```

Requirements:
1. Cover the last 7 calendar days (today − 6 days through today, UTC).
2. Produce a `dailyBreakdown` array with exactly 7 entries, one per day — even if `revenue` and `orderCount` are both 0 for a day.
3. Sum `totalRevenue` and `totalOrders` across the full week.

### Success Criteria
- [ ] `GET /api/reports/daily` returns `totalRevenue`, `orderCount`, and `topProducts` for today's orders.
- [ ] `topProducts` contains at most 5 entries, sorted by `quantitySold` descending.
- [ ] `GET /api/reports/weekly` returns `dailyBreakdown` with exactly 7 entries.
- [ ] Each `dailyBreakdown` entry has `date`, `revenue`, and `orderCount`.
- [ ] Both endpoints return `401`/`403` for cashier-role requests.

---

## 🎮 Level 5: Production Bug Investigation & Postmortem
**Difficulty: ⭐⭐⭐⭐⭐ Master**
**Estimated Time: 3–4 hours**
**Points: 75**

### Scenario

> **Support Ticket #POS-9147 — Severity: Critical**
>
> *"The end-of-day register count keeps coming out wrong. Three things happened on Saturday:*
>
> 1. *Two cashiers rang up the last bag of Ethiopian Dark Roast at the same time. Both transactions went through as 'completed', but we only had 1 bag — now inventory shows −1. We had to manually adjust the stock, but this keeps happening.*
>
> 2. *Adriana's receipt for 3 × Coconut Syrup (priced at \$4.67 each) printed a total of \$14.009999999999998 instead of \$14.01. The customer was confused and asked for a manager.*
>
> 3. *The daily report run at 23:58 showed 14 orders but the one run at 00:03 the next morning showed only 2. Same orders, different report windows. The night-shift manager thought the system lost data.*
>
> Please fix all three before Monday's opening."*

These are three distinct production defects. Reproduce each one, fix the root cause, and document your findings.

### Tasks

#### Task 5.1: Fix Oversell, Decimal Drift & Timezone
Address all three defects from the support ticket.

**Defect A — Race condition / oversell:**
Concurrent checkouts for the same product can both read `quantity = 1`, both pass the stock check, and both decrement — driving quantity to −1.
1. Add a `SELECT … FOR UPDATE` (pessimistic lock) on the `Inventory` row before the stock check inside the checkout transaction. In Prisma this is achieved via `prisma.$queryRaw` or by using `prisma.$transaction` with `isolationLevel: Serializable`.
2. Re-run the concurrent checkout test to confirm only one succeeds and inventory never goes negative.

**Defect B — Decimal precision drift:**
JavaScript floating-point math (`0.1 + 0.2 !== 0.3`) can corrupt totals. Prisma returns `Decimal` objects for `@db.Decimal` columns, but arithmetic on plain JS numbers loses precision.
1. Perform all money arithmetic using `Decimal.js` (already bundled with `@prisma/client`) or the `Decimal` type returned by Prisma — never cast to `Number` before multiplying/adding.
2. Round the final `total` to 2 decimal places before persisting: `new Prisma.Decimal(total).toDecimalPlaces(2)`.

**Defect C — Timezone / report boundary:**
The daily report uses `new Date()` without pinning to UTC, so near midnight the window shifts with the server's local timezone.
1. Build report date boundaries using explicit UTC: `new Date(Date.UTC(y, m, d, 0, 0, 0))`.
2. Ensure `WHERE createdAt >= startOfDayUTC AND createdAt < endOfDayUTC` consistently captures the same 24-hour window on every call.

#### Task 5.2: Write Postmortem Document
Document the incident so it doesn't recur.

Create a `POSTMORTEM.md` file at the project root containing:

1. **Incident Summary** — one paragraph describing what cashiers observed on Saturday.
2. **Root Cause Analysis** — a section for each defect:
   - **Race condition / oversell**: explain why concurrent transactions both succeeded, and how pessimistic locking prevents it.
   - **Decimal precision**: explain floating-point representation and why `Decimal.js` avoids the drift.
   - **Timezone boundary**: explain why server-local `new Date()` shifts the report window near midnight, and how UTC boundaries fix it.
3. **Fix Summary** — what code was changed and where.
4. **Prevention** — process or tooling changes to catch these classes of bugs before production (e.g., load tests for concurrency, property-based tests for money math, UTC-first date handling conventions).

### Success Criteria
- [ ] Concurrent checkouts of a 1-stock item: exactly one succeeds (`201`), the other fails (`409`/`400`).
- [ ] Inventory quantity never goes below 0 after concurrent checkouts.
- [ ] Order totals stored in the database have at most 2 decimal places.
- [ ] Daily report returns the same `orderCount` on consecutive calls within the same UTC day.
- [ ] `POSTMORTEM.md` exists at the project root.
- [ ] `POSTMORTEM.md` explains the race condition / oversell root cause.
- [ ] `POSTMORTEM.md` explains the decimal precision root cause.
- [ ] `POSTMORTEM.md` explains the timezone root cause.

---

## 📝 Submission Guidelines

1. Create a branch: `level-X-solution` (e.g., `level-3-solution`).
2. Commit with descriptive messages (e.g., `feat: add pagination to products endpoint`).
3. Document architectural decisions and tradeoffs in `NOTES.md`.
4. Open a Pull Request with:
   - A summary of what you changed.
   - Steps to test the changes manually.
   - Any assumptions you made.

---

## 🏆 Scoring Summary

| Level | Points | Difficulty |
|-------|--------|------------|
| 1     | 10     | ⭐ Easy |
| 2     | 25     | ⭐⭐ Medium |
| 3     | 40     | ⭐⭐⭐ Hard |
| 4     | 60     | ⭐⭐⭐⭐ Expert |
| 5     | 75     | ⭐⭐⭐⭐⭐ Master |
| **Total** | **210** | |

**Bonus Points:** Clean code, extra test coverage, well-written `NOTES.md`, and creative solutions to the Level-5 defects earn bonus points at the reviewer's discretion.
