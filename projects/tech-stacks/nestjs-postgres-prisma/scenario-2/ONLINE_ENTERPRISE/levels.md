# BrewHaven — Backend Developer Challenge Levels

Welcome to IPPO Software Solutions! You've been hired as a backend developer and assigned to build and maintain the BrewHaven E-Commerce API. Complete these challenges to level up your backend engineering skills!

---

## 🎮 Level 1: Environment Setup & Database Initialization
**Difficulty: ⭐ Easy**
**Estimated Time: 30 minutes**
**Points: 10**

### Scenario
You just cloned the backend repository. Set up the environment and ensure everything runs correctly. Then extend the product schema with a field specific to the coffee catalog.

### Tasks

#### Task 1.1: Environment Setup
1. Install dependencies (`npm install`)
2. Configure `.env` from `.env.example`
3. Run Prisma migrations (`npm run prisma:migrate`)
4. Generate Prisma client (`npm run prisma:generate`)
5. Seed the database (`npm run prisma:seed`)
6. Start the server (`npm run start:dev`)
7. Verify the API responds at `http://localhost:3000/api`

#### Task 1.2: Minor Schema Update
Add a new optional field `roastLevel` (String) to the Product model so coffee bean products can specify their roast intensity.

- Update `prisma/schema.prisma`
- Run a new migration (`npm run prisma:migrate`)
- Update the seed script to include roast levels for coffee bean products (e.g., `"Light"`, `"Medium"`, `"Dark"`)
- Confirm that `roastLevel` appears in product create/update/list responses

### Success Criteria
- [ ] Server runs without errors on `http://localhost:3000/api`
- [ ] Database migrated successfully
- [ ] Seed data inserted (users, categories, products, sample orders)
- [ ] New `roastLevel` field is optional and persists correctly through product endpoints

---

## 🎮 Level 2: Product Browsing & Category Bug Fix
**Difficulty: ⭐⭐ Medium**
**Estimated Time: 1–2 hours**
**Points: 25**

### Scenario
The BrewHaven team wants to improve the product browsing experience. Customers currently receive all products in one huge response, and QA found that deleted categories still appear in the public listing.

### Tasks

#### Task 2.1: Paginated & Category-Filterable Products
Improve `GET /api/products` to support pagination and filtering:

- Support `?page=` and `?limit=` query parameters (default: page 1, limit 10)
- Return `{ data, total, page, limit, totalPages }` response shape
- Support `?categoryId=` query parameter to filter by category
- Combine with the existing `?search=` parameter (all filters should stack)

#### Task 2.2: Fix Soft-Deleted Categories Visibility
Soft-deleted categories (where `isActive = false`) still appear in the public category list, and their products still show up in search results.

- Fix the `findAll()` method in `CategoriesService` to exclude inactive categories
- Exclude products that belong to an inactive category from `GET /api/products` public results
- Products under inactive categories should remain accessible to admins but hidden from customers

### Success Criteria
- [ ] `GET /api/products` returns paginated results with correct metadata
- [ ] Products can be filtered by `categoryId` and `search` in any combination
- [ ] `GET /api/categories` no longer returns inactive categories to public requests
- [ ] Products belonging to inactive categories are excluded from public product listings

---

## 🎮 Level 3: Checkout Logic & Order Lifecycle
**Difficulty: ⭐⭐⭐ Hard**
**Estimated Time: 2–3 hours**
**Points: 40**

### Scenario
Customers are placing orders but the checkout is incomplete — stock isn't being validated, tax isn't applied, and unsupported payment methods are slipping through. The admin also has no way to advance orders through their lifecycle.

### Tasks

#### Task 3.1: Transactional Checkout — Stock, Tax & Payment Validation
Implement the full checkout flow inside a Prisma interactive transaction (`$transaction`):

**Stock validation & deduction:**
- Check that each ordered product has sufficient stock before creating the order
- If any item exceeds available stock, reject the entire order with a clear error message
- Atomically deduct stock from each product on successful order creation

**Tax calculation:**
- Apply a configurable tax rate (default 8%) to the order subtotal
- Calculate: `total = subtotal + tax - discount`
- Store the `tax` amount on the order record
- Round all monetary values to 2 decimal places

**Payment method validation:**
- Only allow `CASH` or `CARD` as payment methods
- Reject orders with any other value with a descriptive 400 error

#### Task 3.2: Order Lifecycle State Machine
Add `PATCH /api/orders/:id/status` (admin only) that enforces valid order status transitions:

- `PENDING` → `PROCESSING`
- `PROCESSING` → `SHIPPED`
- `SHIPPED` → `DELIVERED`
- Any status → `CANCELLED` (except `DELIVERED`)

Reject invalid transitions with a 400 error and a message identifying the attempted transition.

### Success Criteria
- [ ] Orders fail gracefully when any product has insufficient stock
- [ ] Stock is deducted atomically on successful order creation; rolled back on failure
- [ ] Tax is calculated correctly and stored on each order
- [ ] Orders with unsupported payment methods are rejected
- [ ] Valid order status transitions succeed; invalid ones are rejected with 400

---

## 🎮 Level 4: Reporting & Analytics
**Difficulty: ⭐⭐⭐⭐ Expert**
**Estimated Time: 2–3 hours**
**Points: 60**

### Scenario
The BrewHaven owner wants a reporting dashboard and wants to be alerted when stock is running low. Implement the backend endpoints that power daily and weekly sales reports, and a low-stock alert.

### Tasks

#### Task 4.1: Daily & Weekly Sales Reports
Implement two sales reporting endpoints (admin only):

**Daily Report** — `GET /api/reports/daily`
- Total revenue for today
- Number of orders placed today
- Top 5 best-selling products (by quantity sold)
- Average order value

**Weekly Report** — `GET /api/reports/weekly`
- Daily breakdown for the last 7 days: `{ date, revenue, orderCount }` per day
- Total revenue for the week
- Total orders for the week
- Top 10 best-selling products for the week (by quantity sold)

#### Task 4.2: Low-Stock Alert Endpoint
Create `GET /api/reports/low-stock` (admin only):

- Return all products where `stock` is at or below a threshold
- Support `?threshold=` query parameter (default 10)
- Each entry includes: `productName`, `sku`, `currentStock`, `categoryName`
- Sort results by stock level ascending (lowest first)

### Success Criteria
- [ ] Daily report returns accurate totals scoped to the current calendar day
- [ ] Weekly report provides a correct day-by-day breakdown for the last 7 days
- [ ] Top-selling products are ranked by total quantity sold (descending)
- [ ] Low-stock endpoint respects the threshold parameter and sorts by stock ascending

---

## 🎮 Level 5: Production Bug Investigation
**Difficulty: ⭐⭐⭐⭐⭐ Master**
**Estimated Time: 3–4 hours**
**Points: 75**

### Scenario: The "Ghost Orders" Incident

**Support Ticket from BrewHaven Owner:**
> "Two customers ordered the last bag of Ethiopian Yirgacheffe at the same time. Both orders went through, but we only had 1 in stock. Now inventory shows -1 and two customers are expecting their coffee! Also, one of the order totals shows $24.999999 instead of $25.00, and our daily report is off by one order — the last order of the day keeps appearing or disappearing."

### Reported Issues
1. Concurrent checkouts can oversell inventory (race condition)
2. Order totals sometimes have rounding errors (`$24.999999` instead of `$25.00`)
3. Daily reports show inconsistent order counts when orders are placed near midnight (timezone issue)

### Tasks

#### Task 5.1: Fix All Three Production Bugs

**Race condition — oversold inventory:**
1. Simulate two concurrent checkout requests for the same 1-stock product
2. Implement pessimistic locking using Prisma's `$transaction` with `SELECT ... FOR UPDATE` on the product rows
3. Ensure only the first checkout succeeds; the second receives a clear stock-error response

**Decimal precision — rounding drift:**
- Review all Decimal calculations (subtotal, tax, total)
- Ensure consistent rounding to 2 decimal places using `Decimal.toFixed(2)` or Prisma's Decimal type handling
- Verify that no intermediate float arithmetic introduces drift

**Timezone inconsistency in reports:**
- Identify where daily date boundaries are computed in the reporting service
- Ensure consistent use of UTC or a configured `APP_TIMEZONE` environment variable
- Fix the daily report to correctly capture orders from `00:00:00` to `23:59:59` in the store's configured timezone

#### Task 5.2: Write a Root-Cause Analysis Document
Create a `POSTMORTEM.md` at the project root explaining:
- What caused each issue (race condition, decimal drift, timezone bug)
- How each fix works
- What safeguards prevent recurrence

### Success Criteria
- [ ] Concurrent checkouts on a 1-stock product result in exactly one success and one failure
- [ ] All monetary values on orders are correctly rounded to 2 decimal places
- [ ] Daily report returns consistent order counts regardless of when it is run
- [ ] `POSTMORTEM.md` clearly explains all three root causes and the fixes applied

---

## 📝 Submission Guidelines

For each level completed:

1. **Create a branch:** `level-X-solution` (e.g., `level-1-solution`)
2. **Commit changes** with clear, descriptive messages
3. **Document decisions** in comments or a `NOTES.md` file
4. **Open a Pull Request** with:
   - Summary of changes
   - Steps to test
   - Any assumptions made

---

## 🏆 Scoring Summary

| Level   | Points | Difficulty          |
| ------- | ------ | ------------------- |
| Level 1 | 10     | ⭐ Easy             |
| Level 2 | 25     | ⭐⭐ Medium         |
| Level 3 | 40     | ⭐⭐⭐ Hard         |
| Level 4 | 60     | ⭐⭐⭐⭐ Expert     |
| Level 5 | 75     | ⭐⭐⭐⭐⭐ Master   |

**Bonus Points:** Clean code, extra features, comprehensive documentation, unit tests.

---

Good luck, backend engineer! 🚀
