# FlexiSpend — Backend Developer Challenge Levels

Welcome to IPPO Software Solutions! You've been hired as a backend developer and assigned to build and maintain the FlexiSpend Personal Finance API. Complete these challenges to level up your backend engineering skills!

---

## 🎮 Level 1: Environment Setup & Database Initialization
**Difficulty: ⭐ Easy**
**Estimated Time: 30 minutes**
**Points: 10**

### Scenario
You just cloned the backend repository. Set up the environment and ensure everything runs correctly. Then extend the schema with a small but useful field.

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
Add a new optional field `note` (String) to the Transaction model to allow users to attach a short memo to any transaction.

- Update `prisma/schema.prisma`
- Run a new migration (`npm run prisma:migrate`)
- Update the seed script to include notes on a few sample transactions
- Confirm that `note` appears in transaction create/update/list responses

### Success Criteria
- [ ] Server runs without errors on `http://localhost:3000/api`
- [ ] Database migrated successfully
- [ ] Seed data inserted (users, categories, accounts, transactions, budgets)
- [ ] New `note` field is optional and persists correctly through transaction endpoints

---

## 🎮 Level 2: Transaction Filtering & Category Bug Fix
**Difficulty: ⭐⭐ Medium**
**Estimated Time: 1–2 hours**
**Points: 25**

### Scenario
The FlexiSpend team wants to improve the transaction browsing experience. Users currently have no way to page through large transaction histories, and QA has found a bug where deleted categories still show up in the category list.

### Tasks

#### Task 2.1: Paginated & Filterable Transactions
Improve `GET /api/transactions` to support pagination and filtering:

- Support `?page=` and `?limit=` query parameters (default: page 1, limit 20)
- Return `{ data, total, page, limit, totalPages }` response shape
- Support `?startDate=` and `?endDate=` query parameters (ISO date strings)
- Support `?accountId=` query parameter
- Support `?type=` query parameter (`INCOME` or `EXPENSE`)
- All filters should combine with the existing `?categoryId=` filter

#### Task 2.2: Fix Soft-Deleted Categories Visibility
Soft-deleted categories (where `isActive = false`) still appear when users list their categories.

- Fix the `findAll()` method in `CategoriesService` to exclude inactive categories
- Ensure transactions linked to inactive categories still display the category name correctly
- Prevent new transactions from referencing inactive categories (reject with a clear error)

### Success Criteria
- [ ] `GET /api/transactions` returns paginated results with correct metadata
- [ ] Transactions can be filtered by `startDate`, `endDate`, `accountId`, `type`, and `categoryId` in any combination
- [ ] `GET /api/categories` no longer returns inactive categories
- [ ] Creating a transaction with an inactive `categoryId` is rejected with an error

---

## 🎮 Level 3: Balance Logic, Validation & Budget Tracking
**Difficulty: ⭐⭐⭐ Hard**
**Estimated Time: 2–3 hours**
**Points: 40**

### Scenario
Users are recording transactions but account balances aren't updating and the budget tracking is incomplete. You need to implement proper balance management, input validation, and budget reporting.

### Tasks

#### Task 3.1: Atomic Balance Mutation, Funds Guard & Field Validation
Implement the full transaction write path:

**Balance updates:**
- When creating a transaction, update the account balance atomically inside a Prisma interactive transaction (`$transaction`)
  - `INCOME` → increase balance
  - `EXPENSE` → decrease balance
- When deleting a transaction, reverse the balance change
- When updating a transaction (amount or type change), recalculate accordingly

**Insufficient funds guard:**
- Reject an `EXPENSE` when the account balance would go negative, unless `allowNegativeBalance` is `true` on the account
- Return a clear error message on rejection

**Field validation:**
- `amount` must be a positive number
- `type` must be `INCOME` or `EXPENSE`
- `date` must not be in the future
- `accountId` and `categoryId` must exist and belong to the current user

#### Task 3.2: Budget-vs-Actual Tracking
Extend `GET /api/budgets?month=&year=` to return spending data for each budget:

- Calculate `spent` = sum of `EXPENSE` transactions for the budget's category in the given `month`/`year`
- Return each budget entry as `{ budgetId, category, budgetAmount, spent, remaining, percentUsed, exceeded }`
  - `remaining = budgetAmount - spent`
  - `percentUsed = (spent / budgetAmount) * 100`
  - `exceeded = true` when `spent > budgetAmount`

### Success Criteria
- [ ] Account balances update correctly (and atomically) on transaction create, update, and delete
- [ ] `EXPENSE` transactions fail with a clear error when the account has insufficient funds (unless `allowNegativeBalance` is true)
- [ ] Invalid transaction inputs are rejected with descriptive error messages
- [ ] `GET /api/budgets` returns accurate `spent`, `remaining`, `percentUsed`, and `exceeded` for the requested month/year

---

## 🎮 Level 4: Reporting & Analytics
**Difficulty: ⭐⭐⭐⭐ Expert**
**Estimated Time: 2–3 hours**
**Points: 60**

### Scenario
The product owner wants a reporting dashboard. You need to build the backend endpoints that power monthly summaries, category breakdowns, multi-month trends, and budget alert notifications.

### Tasks

#### Task 4.1: Monthly Summary & Trend Reports
Implement two time-series reporting endpoints:

**Monthly Summary** — `GET /api/reports/monthly-summary?month=&year=`
- Total income for the month
- Total expenses for the month
- Net savings (income − expenses)
- Number of transactions
- Average transaction amount by type

**Trend Report** — `GET /api/reports/trends?months=`
- Monthly income and expense totals for the past N months (default 6)
- Each entry: `{ month, year, totalIncome, totalExpense, netSavings }`
- Sorted chronologically (oldest first)

#### Task 4.2: Category Breakdown & Budget Alerts
Implement two category-focused reporting endpoints:

**Category Breakdown** — `GET /api/reports/category-breakdown?month=&year=&type=`
- Spending (or income) broken down by category
- Each entry: `{ categoryName, total, percentage, transactionCount }`
- `type` defaults to `EXPENSE`
- Sorted by `total` descending

**Budget Alerts** — `GET /api/reports/budget-alerts` (authenticated)
- Return all budgets for the current month where `spent >= 80%` of `budgetAmount`
- Each entry includes: category name, budget amount, spent, remaining, percentUsed
- Sorted by `percentUsed` descending (most critical first)

### Success Criteria
- [ ] Monthly summary returns accurate income, expense, and net savings totals
- [ ] Trend report returns N months of data sorted chronologically
- [ ] Category breakdown shows correct percentages and is sorted by total descending
- [ ] Budget alerts only include budgets at or above 80% and are sorted by urgency

---

## 🎮 Level 5: Production Bug Investigation
**Difficulty: ⭐⭐⭐⭐⭐ Master**
**Estimated Time: 3–4 hours**
**Points: 75**

### Scenario: The "Phantom Balance" Incident

**Support Ticket from a FlexiSpend User:**
> "I deleted two expense transactions from last week, but my account balance didn't go back up. Now my balance shows ₱2,400 instead of ₱4,400. Also, my monthly summary shows different totals depending on when I check it — the numbers change near midnight!"

### Reported Issues
1. Deleting or updating transactions does not always reverse the account balance correctly (race condition or missing rollback)
2. Monthly reports show inconsistent totals when transactions are recorded near midnight (timezone issue)
3. Budget percentages sometimes show `NaN%` or `Infinity%` when the budget amount is zero or null

### Tasks

#### Task 5.1: Fix All Three Production Bugs

**Balance drift (Race condition):**
1. Simulate rapid create-update-delete sequences on transactions for the same account
2. Identify where the balance update logic fails (concurrent writes, missing rollback on error)
3. Implement pessimistic locking using Prisma's `$transaction` with `SELECT ... FOR UPDATE` on the account row
4. Ensure only one balance mutation can occur at a time per account

**Timezone inconsistency:**
- Identify where date boundaries are calculated in the reporting service
- Ensure consistent use of UTC or a configured `APP_TIMEZONE` environment variable
- Fix monthly summary to correctly capture transactions from the 1st `00:00:00` to the last day `23:59:59` of the month in the configured timezone

**Division-by-zero in budget calculations:**
- Review all budget percentage calculations
- Guard against `budgetAmount = 0` or `null` producing `NaN` or `Infinity`
- Return `percentUsed: 0` when `budgetAmount` is zero, with `exceeded: true` if `spent > 0`

#### Task 5.2: Write a Root-Cause Analysis Document
Create a `POSTMORTEM.md` at the project root explaining:
- What caused each issue (balance drift, timezone bug, division-by-zero)
- How each fix works
- What safeguards prevent recurrence

### Success Criteria
- [ ] Account balances are consistent after any sequence of transaction create/update/delete operations
- [ ] All monetary values are correctly rounded to 2 decimal places
- [ ] Reports return consistent totals regardless of when they are run
- [ ] Budget calculations never produce `NaN` or `Infinity`
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
