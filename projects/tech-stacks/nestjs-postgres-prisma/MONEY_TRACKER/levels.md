# FlexiSpend — Backend Developer Challenge Levels

Welcome to IPPO Software Solutions! You've been hired as a backend developer and assigned to build and maintain the FlexiSpend Personal Finance API. Complete these challenges to level up your backend engineering skills!

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
Add a new optional field `note` (String) to the Transaction model to allow users to attach a short memo to any transaction.

- Update `prisma/schema.prisma`
- Run a new migration
- Update the seed script to include notes on a few sample transactions

### Success Criteria
- [ ] Server runs without errors on `http://localhost:3000/api`
- [ ] Database migrated successfully
- [ ] Seed data inserted (users, categories, accounts, transactions, budgets)
- [ ] New `note` field works properly in transaction endpoints

---

## 🎮 Level 2: Transaction & Category Improvements
**Difficulty: ⭐⭐ Medium**
**Estimated Time: 1–2 hours**
**Points: 25**

### Scenario
The FlexiSpend team wants to improve the transaction browsing experience. QA has also found a bug in the category listing.

### Tasks

#### Task 2.1: Add Pagination to Transactions
The transaction list returns all records at once. Implement pagination:
- Support `?page=` and `?limit=` query parameters
- Default: page 1, limit 20
- Return `{ data, total, page, limit, totalPages }` shape

#### Task 2.2: Add Date Range & Account Filtering
Allow filtering transactions by date range and account:
- Support `?startDate=` and `?endDate=` query parameters
- Support `?accountId=` query parameter
- Support `?type=` query parameter (INCOME or EXPENSE)
- Combine with existing `?categoryId=` filter

#### Task 2.3: Fix Soft-Deleted Categories Bug
Soft-deleted categories (where `isActive = false`) still appear when users list their categories.
- Fix the `findAll()` method in `CategoriesService` to filter out inactive categories
- Ensure transactions linked to inactive categories still display correctly (show category name) but prevent new transactions from using inactive categories

### Success Criteria
- [ ] Transactions endpoint supports pagination with correct metadata
- [ ] Transactions can be filtered by date range, account, type, and category
- [ ] Inactive categories are hidden from the category listing
- [ ] New transactions cannot reference inactive categories

---

## 🎮 Level 3: Account Balance & Budget Logic
**Difficulty: ⭐⭐⭐ Hard**
**Estimated Time: 2–3 hours**
**Points: 40**

### Scenario
Users are recording transactions, but account balances aren't updating correctly and the budget tracking is incomplete. You need to implement proper balance management and budget enforcement.

### Tasks

#### Task 3.1: Implement Atomic Balance Updates
- When creating a transaction, update the associated account's balance transactionally
  - INCOME → increase balance
  - EXPENSE → decrease balance
- When deleting a transaction, reverse the balance change
- When updating a transaction (amount or account change), recalculate accordingly
- Use a Prisma interactive transaction to ensure atomicity

#### Task 3.2: Implement Insufficient Balance Validation
- When recording an EXPENSE, check that the account has sufficient balance
- If the expense exceeds available balance, reject the transaction with a clear error message
- Make this configurable: allow a `allowNegativeBalance` flag on the Account model (default `false`)

#### Task 3.3: Implement Budget-vs-Actual Tracking
- When listing budgets (`GET /api/budgets?month=&year=`), calculate and return `spent` for each budget category
  - `spent` = sum of EXPENSE transactions for that category in the given month/year
- Return `{ budgetId, category, budgetAmount, spent, remaining, percentUsed }` shape
- Flag budgets where `spent > budgetAmount` as `exceeded: true`

#### Task 3.4: Validate Transaction Fields
- `amount` must be a positive number
- `type` must be `INCOME` or `EXPENSE`
- `date` must not be in the future
- `accountId` and `categoryId` must exist and belong to the current user
- Reject invalid transactions with descriptive error messages

### Success Criteria
- [ ] Account balances update atomically with every transaction create/update/delete
- [ ] Expense transactions fail gracefully when balance is insufficient (unless `allowNegativeBalance` is true)
- [ ] Budget listing returns accurate spent/remaining/percentUsed data
- [ ] Invalid transaction inputs are rejected with clear error messages

---

## 🎮 Level 4: Reporting & Analytics
**Difficulty: ⭐⭐⭐⭐ Expert**
**Estimated Time: 2–3 hours**
**Points: 60**

### Scenario
The FlexiSpend product owner wants a reporting dashboard. Implement the backend endpoints that power monthly and trend reports.

### Tasks

#### Task 4.1: Implement Monthly Summary Report
`GET /api/reports/monthly-summary?month=&year=` should return:
- Total income for the month
- Total expenses for the month
- Net savings (income - expenses)
- Number of transactions
- Average transaction amount (by type)

#### Task 4.2: Implement Category Breakdown Report
`GET /api/reports/category-breakdown?month=&year=&type=` should return:
- Breakdown of spending (or income) by category
- Each entry: `{ categoryName, total, percentage, transactionCount }`
- Sorted by total (descending)
- Support filtering by `type` (INCOME or EXPENSE; default EXPENSE)

#### Task 4.3: Implement Trend Report
`GET /api/reports/trends?months=` should return:
- Monthly income and expense totals for the past N months (default 6)
- Each entry: `{ month, year, totalIncome, totalExpense, netSavings }`
- Sorted chronologically

#### Task 4.4: Add Budget Alert Endpoint
Create `GET /api/reports/budget-alerts` (authenticated):
- Return all budgets for the current month where `spent >= 80%` of `budgetAmount`
- Include category name, budget amount, spent, remaining, and percentage used
- Sort by `percentUsed` descending (most critical first)

### Success Criteria
- [ ] Monthly summary returns accurate income, expense, and net savings totals
- [ ] Category breakdown shows correct percentages and is sorted by total
- [ ] Trend report provides month-by-month data for the requested period
- [ ] Budget alerts correctly identify categories nearing or exceeding their limits

---

## 🎮 Level 5: Production Bug Investigation
**Difficulty: ⭐⭐⭐⭐⭐ Master**
**Estimated Time: 3–4 hours**
**Points: 75**

### Scenario: The "Phantom Balance" Incident

**Support Ticket from a FlexiSpend User:**
> "I deleted two expense transactions from last week, but my account balance didn't go back up. Now my balance shows ₱2,400 instead of ₱4,400. Also, my monthly summary shows different totals depending on when I check it — the numbers change near midnight!"

### Reported Issues
1. Deleting or updating transactions does not always reverse/recalculate the account balance correctly (race condition or missing rollback)
2. Monthly reports show inconsistent totals when transactions are recorded near midnight (timezone issue)
3. Budget percentages sometimes show `NaN%` or `Infinity%` when the budget amount is zero or null

### Tasks

#### Task 5.1: Reproduce & Fix the Balance Drift Bug
1. Simulate rapid create-update-delete sequences on transactions for the same account
2. Identify where the balance update logic fails (e.g., concurrent writes, missing rollback on error)
3. Implement pessimistic locking using Prisma's `$transaction` with `SELECT ... FOR UPDATE` on the account row
4. Ensure that only one balance mutation can occur at a time per account

#### Task 5.2: Fix Timezone Inconsistencies in Reports
- Identify where date boundaries are calculated in the reporting service
- Ensure consistent use of UTC or a configured timezone
- Fix monthly summary to correctly capture transactions from the 1st 00:00:00 to the last day 23:59:59 of the month in the user's timezone

#### Task 5.3: Fix Division-by-Zero in Budget Calculations
- Review all budget percentage calculations
- Guard against `budgetAmount = 0` or `null` producing `NaN` or `Infinity`
- Return `percentUsed: 0` when `budgetAmount` is zero, with an `exceeded` flag based on whether `spent > 0`

#### Task 5.4: Write a Root-Cause Analysis Document
Create a `POSTMORTEM.md` explaining:
- What caused each issue
- How each fix works
- What safeguards prevent recurrence

### Success Criteria
- [ ] Account balances are always consistent after any sequence of transaction operations
- [ ] All monetary values are correctly rounded to 2 decimal places
- [ ] Reports return consistent totals regardless of when they're run
- [ ] Budget calculations handle edge cases without producing `NaN` or `Infinity`
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
