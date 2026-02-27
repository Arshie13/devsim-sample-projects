# BrewHaven - Backend Developer Challenge Levels

Welcome to IPPO Software Solutions! You've been hired as a backend developer and assigned to build and maintain the BrewHaven E-Commerce API. Complete these challenges to level up your backend engineering skills!

---

## 🎮 Level 1: Environment Setup & Database Initialization
**Difficulty: ⭐ Easy**
**Estimated Time: 30 minutes**
**Points: 10**

### Scenario
You just cloned the backend repository. Set up the environment and ensure everything runs correctly.

### Tasks

#### Task 1.1: Environment Setup
1. Install dependencies (`npm install`)
2. Configure `.env` from `.env.example`
3. Run Prisma migrations (`npm run prisma:migrate`)
4. Generate Prisma client (`npm run prisma:generate`)
5. Seed the database (`npm run prisma:seed`)
6. Start the server (`npm run start:dev`)

#### Task 1.2: Minor Schema Update
Add a new optional field `roastLevel` (String) to the Product model for coffee bean products.

- Update `prisma/schema.prisma`
- Run a new migration
- Update the seed script to include roast levels for coffee bean products

### Success Criteria
- [ ] Server runs without errors on `http://localhost:3000/api`
- [ ] Database migrated successfully
- [ ] Seed data inserted (users, categories, products, sample orders)
- [ ] New `roastLevel` field works properly in product endpoints

---

## 🎮 Level 2: Product & Category Improvements
**Difficulty: ⭐⭐ Medium**
**Estimated Time: 1–2 hours**
**Points: 25**

### Scenario
The BrewHaven team wants to improve the product browsing experience. QA has also found a bug in the category listing.

### Tasks

#### Task 2.1: Add Pagination to Products
The product list returns all products at once. Implement pagination:
- Support `?page=` and `?limit=` query parameters
- Default: page 1, limit 10
- Return `{ data, total, page, limit, totalPages }` shape

#### Task 2.2: Add Category Filtering
Allow filtering products by category:
- Support `?categoryId=` query parameter
- Combine with existing `?search=` parameter

#### Task 2.3: Fix Soft-Deleted Categories Bug
Soft-deleted categories (where `isActive = false`) still appear in the public category list.
- Fix the `findAll()` method in `CategoriesService` to filter out inactive categories
- Ensure products linked to inactive categories do not appear in public product listings

### Success Criteria
- [ ] Products endpoint supports pagination with correct metadata
- [ ] Products can be filtered by category
- [ ] Inactive categories are hidden from public listing
- [ ] Products under inactive categories are excluded from public results

---

## 🎮 Level 3: Checkout & Order Logic
**Difficulty: ⭐⭐⭐ Hard**
**Estimated Time: 2–3 hours**
**Points: 40**

### Scenario
Customers are placing orders, but the checkout logic is incomplete. You need to implement proper stock validation, tax calculation, and order status management.

### Tasks

#### Task 3.1: Implement Stock Validation During Checkout
- When creating an order, check that each product has sufficient stock
- If any item exceeds available stock, reject the entire order with a clear error message
- Use a Prisma interactive transaction to atomically deduct stock and create the order

#### Task 3.2: Implement Tax Calculation
- Apply a configurable tax rate (default 8%) to the order subtotal
- Calculate: `total = subtotal + tax - discount`
- Store the tax amount on the order record

#### Task 3.3: Implement Order Status Transitions
- Add a `PATCH /api/orders/:id/status` endpoint (admin only)
- Enforce valid transitions:
  - PENDING → PROCESSING
  - PROCESSING → SHIPPED
  - SHIPPED → DELIVERED
  - Any status → CANCELLED (except DELIVERED)
- Reject invalid transitions with a 400 error

#### Task 3.4: Validate Payment Method
- Only allow `CASH` or `CARD` as payment methods
- Reject orders with unsupported payment methods

### Success Criteria
- [ ] Orders fail gracefully when stock is insufficient
- [ ] Stock is deducted atomically on successful order creation
- [ ] Tax is calculated and stored on each order
- [ ] Order status transitions follow the defined state machine
- [ ] Invalid payment methods are rejected

---

## 🎮 Level 4: Reporting & Analytics
**Difficulty: ⭐⭐⭐⭐ Expert**
**Estimated Time: 2–3 hours**
**Points: 60**

### Scenario
The BrewHaven owner wants a reporting dashboard. Implement the backend endpoints that power daily and weekly sales reports.

### Tasks

#### Task 4.1: Implement Daily Sales Report
`GET /api/reports/daily` should return:
- Total revenue for today
- Number of orders placed today
- Top 5 best-selling products (by quantity)
- Average order value

#### Task 4.2: Implement Weekly Sales Report
`GET /api/reports/weekly` should return:
- Daily breakdown for the last 7 days (date, revenue, order count)
- Total revenue for the week
- Total orders for the week
- Top 10 best-selling products for the week

#### Task 4.3: Add Low-Stock Alert Endpoint
Create `GET /api/reports/low-stock` (admin only):
- Return all products where `stock` is below a threshold (default 10)
- Support `?threshold=` query parameter
- Include product name, SKU, current stock, and category name

### Success Criteria
- [ ] Daily report returns accurate totals for the current day
- [ ] Weekly report provides a day-by-day breakdown
- [ ] Top-selling products are ranked by quantity sold
- [ ] Low-stock endpoint correctly identifies products below threshold

---

## 🎮 Level 5: Production Bug Investigation
**Difficulty: ⭐⭐⭐⭐⭐ Master**
**Estimated Time: 3–4 hours**
**Points: 75**

### Scenario: The "Ghost Orders" Incident

**Support Ticket from BrewHaven Owner:**
> "Two customers ordered the last bag of Ethiopian Yirgacheffe at the same time. Both orders went through, but we only had 1 in stock. Now inventory shows -1 and two customers are expecting their coffee!"

### Reported Issues
1. Concurrent checkouts can oversell inventory (race condition)
2. Order totals sometimes show rounding errors ($24.999999 instead of $25.00)
3. Daily reports show inconsistent order counts when orders are placed near midnight (timezone issue)

### Tasks

#### Task 5.1: Reproduce & Fix the Race Condition
1. Simulate two concurrent checkout requests for the same low-stock product
2. Implement pessimistic locking using Prisma's `$transaction` with `SELECT ... FOR UPDATE`
3. Ensure only the first checkout succeeds; the second receives a stock error

#### Task 5.2: Fix Decimal Precision Issues
- Review all Decimal calculations (subtotal, tax, total)
- Ensure rounding to 2 decimal places using `Decimal.toFixed(2)` or Prisma's Decimal handling
- Add validation that prevents floating-point drift

#### Task 5.3: Fix Timezone Inconsistencies in Reports
- Identify where date boundaries are calculated in the reporting service
- Ensure consistent use of UTC or a configured timezone
- Fix daily report to correctly capture orders from 00:00:00 to 23:59:59 in the store's timezone

#### Task 5.4: Write a Root-Cause Analysis Document
Create a `POSTMORTEM.md` explaining:
- What caused each issue
- How each fix works
- What safeguards prevent recurrence

### Success Criteria
- [ ] Concurrent checkouts cannot oversell inventory
- [ ] All monetary values are correctly rounded to 2 decimal places
- [ ] Reports return consistent counts regardless of when they're run
- [ ] Postmortem document clearly explains root causes and fixes

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

| Level   | Points | Difficulty        |
| ------- | ------ | ----------------- |
| Level 1 | 10     | ⭐ Easy           |
| Level 2 | 25     | ⭐⭐ Medium       |
| Level 3 | 40     | ⭐⭐⭐ Hard       |
| Level 4 | 60     | ⭐⭐⭐⭐ Expert   |
| Level 5 | 75     | ⭐⭐⭐⭐⭐ Master |

**Bonus Points:** Clean code, extra features, comprehensive documentation, unit tests.

---

Good luck, backend engineer! 🚀