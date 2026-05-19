# Expense Tracker — Frontend Developer Challenge Levels

Welcome to Expense Tracker! You've been hired as a frontend developer to build and enhance the Expense Tracker app — a tool that helps people log expenses and stay on top of their spending.

The five levels below form a **gradual ramp**: Level 1 is a gentle onboarding step, and each level after it is meaningfully harder than the last. Finish them in order.

Every level has **two tasks**, and each task is tagged **[Server]** (API routes, Prisma schema, data layer) or **[Client]** (pages, components, UI). Levels mix the two — some pair one of each, some are two of a kind.

> **Theme of this scenario:** shaping and controlling spending data — customization, recurring entries, budgets, and bulk data handling.

---

## 🎮 Level 1: Onboarding & First Change
**Difficulty: ⭐ Easy**
**Estimated Time: 30 minutes**
**Points: 10**
**Mix: 2 Server**

### Scenario
You just cloned the Expense Tracker repository. Get it running locally, then make one small, safe data-layer change — this is a pure back-end level.

### Tasks

#### Task 1.1 — [Server] Get the Project Running & Add a Health Route
1. Install dependencies (`npm install`)
2. Copy `.env.example` to `.env` and fill in the database URL
3. Start MongoDB with Docker (`docker-compose up -d`)
4. Generate the Prisma client and push the schema (`npx prisma generate`, `npm run db:push`)
5. Seed the database (`npm run db:seed`) and start the dev server (`npm run dev`)
6. Add a health-check route at `src/app/api/health/route.ts` that responds to `GET` with `{ status: "ok" }`

#### Task 1.2 — [Server] Add a Payment Method Field
Record how each expense was paid.
- Add an optional `paymentMethod` field (`String?`) to the `Expense` model in `prisma/schema.prisma`
- Push the schema and update `prisma/seed.ts` so a few seeded expenses have a payment method
- Accept `paymentMethod` in the create-expense Zod schema in `src/app/api/expenses/route.ts`

### Success Criteria
- [ ] App runs without errors and `GET /api/health` returns `{ status: "ok" }`
- [ ] Expenses accept and store an optional `paymentMethod` field

---

## 🎮 Level 2: Category Customization
**Difficulty: ⭐⭐ Medium**
**Estimated Time: 1–1.5 hours**
**Points: 20**
**Mix: 1 Server · 1 Client**

### Scenario
Categories are plain text today. Make them visual and let users manage them directly.

### Tasks

#### Task 2.1 — [Server] Category Fields & CRUD API
- Add `color` (`String`) and `icon` (`String`) fields to the `Category` model in `prisma/schema.prisma`
- Accept `color` and `icon` when creating/updating categories in `src/app/api/categories/route.ts`
- Create `src/app/api/categories/[id]/route.ts` with `PUT` (rename / update) and `DELETE`

#### Task 2.2 — [Client] Category Customization UI
On the homepage:
- Add a color picker and an icon selector to the category form
- Display each category with its color and icon in the expense list
- Add inline editing of category names and a delete button with a confirmation modal
- Show the number of expenses in each category

### Success Criteria
- [ ] Categories store a custom color and icon and can be renamed/deleted via the API
- [ ] The UI customizes, edits, and deletes categories and shows expense counts

---

## 🎮 Level 3: Recurring Expenses
**Difficulty: ⭐⭐⭐ Hard**
**Estimated Time: 2–3 hours**
**Points: 35**
**Mix: 1 Server · 1 Client**

### Scenario
Rent, subscriptions, and bills repeat. Let users mark an expense as recurring and have future entries generated for them.

### Tasks

#### Task 3.1 — [Server] Recurrence Fields & Generation API
- Add `isRecurring` (`Boolean`, default `false`) and `recurrence` (`String?`, e.g. `weekly` / `monthly`) to the `Expense` model
- Accept both fields in the create-expense Zod schema in `src/app/api/expenses/route.ts`
- Create `src/app/api/expenses/recurring/route.ts` that generates the next due instance(s) from recurring templates, computing the next date from the recurrence interval

#### Task 3.2 — [Client] Recurring Expense UI
On the homepage:
- Add a "recurring" checkbox and a frequency selector to the add-expense form
- Show recurring expenses with a badge
- List upcoming generated entries

### Success Criteria
- [ ] Expenses can be flagged recurring and upcoming instances are generated with correct dates
- [ ] The UI captures recurrence and visually distinguishes recurring expenses

---

## 🎮 Level 4: Budgets & Over-Spend Alerts
**Difficulty: ⭐⭐⭐⭐ Expert**
**Estimated Time: 2.5–3.5 hours**
**Points: 55**
**Mix: 1 Server · 1 Client**

### Scenario
Tracking spending isn't enough — users want limits. Let them set monthly budgets per category and warn them when they go over.

### Tasks

#### Task 4.1 — [Server] Budget Model & Tracking API
- Add a `Budget` model to the schema (`amount` `Float`, `month` `String`, relation to `Category`)
- Create `src/app/api/budgets/route.ts` — `GET` lists budgets, `POST` creates one
- For each budget, aggregate the category's total spend for that month (Prisma `_sum`) and return `spent`, `remaining`, and an `overBudget` flag

#### Task 4.2 — [Client] Budgets Page & Alerts
- Create `src/app/budgets/page.tsx` with a form to set a budget per category for a month
- Show a progress bar per budget
- Display a clear over-budget warning when spending exceeds the limit

### Success Criteria
- [ ] Monthly budgets can be set and actual spend is aggregated against them
- [ ] The budgets page shows progress and flags over-budget categories

---

## 🎮 Level 5: Bulk Operations & CSV Import/Export
**Difficulty: ⭐⭐⭐⭐⭐ Master**
**Estimated Time: 3.5–5 hours**
**Points: 80**
**Mix: 1 Server · 1 Client**

### Scenario
Power users manage hundreds of expenses. Give them bulk editing and a way to move data in and out as CSV.

### Tasks

#### Task 5.1 — [Server] Bulk & CSV API
- Create `src/app/api/expenses/bulk/route.ts` accepting an array of expense `ids`, supporting bulk delete (`deleteMany`) and bulk recategorize (`updateMany`)
- Create `src/app/api/expenses/export/route.ts` returning all expenses as CSV (`text/csv`, with a header row)
- Create `src/app/api/expenses/import/route.ts` that parses an uploaded CSV and creates expenses

#### Task 5.2 — [Client] Bulk & CSV UI
On the homepage:
- Add row checkboxes, a select-all control, a selected-count display, and a bulk action bar
- Add an export button and a CSV file-upload input wired to the import route

### Success Criteria
- [ ] Multiple expenses can be deleted or recategorized in one action
- [ ] Expenses export to a valid CSV file and a CSV upload imports them

---
