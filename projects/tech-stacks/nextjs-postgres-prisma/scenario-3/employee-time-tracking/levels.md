# Employee Time Tracking – Developer Challenge Levels

Welcome to WorkPulse Inc.! You've joined the team behind the manager dashboard
of our time-tracking product, built with **Next.js**, **PostgreSQL** and
**Prisma**. The five levels below ramp from a gentle environment warm-up to a
master-level payroll-reporting sweep.

Each task ships with a graded test under `tests/level-N/task-M/`. A task is
complete when its test passes:

```bash
npm run test:tasks:l2      # run every task in Level 2
npm run test:task:l2:t1    # run a single task
```

> **Grading rule:** every test fails on the starter code and passes once you
> finish the task. Tests grade pure helper functions you create under
> `src/lib/` — wiring them into the dashboard is part of the task but the
> function itself is what's scored.

---

## 🎮 Level 1: Environment Setup & Orientation
**Difficulty: ⭐ Easy** · **Estimated Time: 20–30 min**

### Scenario
You just cloned the repo. Get the dashboard running against your own
PostgreSQL database, then add a couple of formatting helpers.

### Task 1.1 — Environment Setup
1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env` and set `DATABASE_URL` to **your own**
   PostgreSQL connection string.
3. Create the schema and generate the client: `npm run prisma:migrate`
4. Load the sample data: `npm run prisma:seed`
5. Start the app: `npm run dev`

**Graded by** `tests/level-1/task-1/setup-check.test.tsx`, which runs
`prisma migrate deploy`, a `SELECT 1` + seed-row smoke query via
`scripts/db-check.ts`, and boots the dev server. Your Postgres password is
never read by the test — it only runs your configured environment.

### Task 1.2 — Formatting Helpers
Create [`src/lib/format.ts`](src/lib/format.ts) exporting:
```ts
export function formatHours(hours: number): string
export function formatCurrency(amount: number): string
```
- `formatHours` always shows one decimal and an `h` suffix (`8` → `"8.0h"`).
- `formatCurrency` shows a `$`, two decimals and comma separators
  (`1234` → `"$1,234.00"`).

Use them across the dashboard's hour and payroll columns.

### Success Criteria
- [ ] `npm run dev` works against your own database
- [ ] Schema migrated and seed data inserted
- [ ] Both helpers exported and used in the UI

---

## 🎮 Level 2: Time Calculations
**Difficulty: ⭐⭐ Medium** · **Estimated Time: 1–1.5 hrs**

### Task 2.1 — Employee Status
Create [`src/lib/time.ts`](src/lib/time.ts) exporting:
```ts
export function getEmployeeStatus(
  entry: { clock_in: string; clock_out: string | null } | null,
): 'clocked-in' | 'clocked-out' | 'off'
```
- `null` entry → `'off'`.
- No `clock_out` → `'clocked-in'`.
- Has a `clock_out` → `'clocked-out'`.

### Task 2.2 — Sum Hours
Add to the same file:
```ts
export function sumHours(
  entries: { clock_in: string; clock_out: string | null }[],
): number
```
- Sum the duration (in hours) of every **completed** entry.
- Ignore entries with no `clock_out`. Round the total to 2 decimals.

Drive the attendance table's status badge and "hours this week" column.

### Success Criteria
- [ ] `getEmployeeStatus` classifies all three states
- [ ] `sumHours` totals completed shifts and skips open ones

---

## 🎮 Level 3: Time-Off Logic
**Difficulty: ⭐⭐⭐ Hard** · **Estimated Time: 2–3 hrs**

### Task 3.1 — Validate Time-Off Request
Create [`src/lib/timeoff.ts`](src/lib/timeoff.ts) exporting:
```ts
export function validateTimeOffRequest(
  req: { start_date: string; end_date: string; hours: number; request_type: string },
): { ok: boolean; errors: string[] }
```
- `start_date` after `end_date` → an error.
- `hours <= 0` → an error.
- `request_type` not one of `vacation`, `sick`, `personal`, `unpaid` → an error.
- `ok` is `true` only when `errors` is empty.

### Task 3.2 — Time-Off Balance
Add to the same file:
```ts
export function computeTimeOffBalance(
  annualAllowance: number,
  requests: { hours: number; status: string; request_type: string }[],
): { used: number; pending: number; remaining: number }
```
- `used` = Σ hours of **approved**, non-`unpaid` requests.
- `pending` = Σ hours of **pending** requests.
- `remaining` = `annualAllowance − used`.

Surface the balance on the time-off tab.

### Success Criteria
- [ ] `validateTimeOffRequest` catches bad dates, hours and types
- [ ] `computeTimeOffBalance` counts only approved non-unpaid hours as used

---

## 🎮 Level 4: Payroll Computation
**Difficulty: ⭐⭐⭐⭐ Expert** · **Estimated Time: 2.5–3.5 hrs**

### Task 4.1 — Split Regular & Overtime
Create [`src/lib/payroll.ts`](src/lib/payroll.ts) exporting:
```ts
export function splitHours(
  totalHours: number,
  threshold?: number,
): { regular: number; overtime: number }
```
- `threshold` defaults to `40`.
- `regular` is hours up to the threshold; `overtime` is anything beyond it.

### Task 4.2 — Gross Pay
Add to the same file:
```ts
export function computeGrossPay(
  regularHours: number,
  overtimeHours: number,
  hourlyRate: number,
): number
```
- Regular hours pay at `hourlyRate`; overtime pays at `1.5 ×` the rate.
- Round the result to 2 decimals.

### Success Criteria
- [ ] `splitHours` splits at the threshold (default and custom)
- [ ] `computeGrossPay` applies the 1.5× overtime multiplier and rounds

---

## 🎮 Level 5: Payroll Reporting
**Difficulty: ⭐⭐⭐⭐⭐ Master** · **Estimated Time: 3–4 hrs**

### Task 5.1 — Payroll Summary
Add to [`src/lib/payroll.ts`](src/lib/payroll.ts):
```ts
export function summarizePayroll(
  records: { regular_hours: number; overtime_hours: number;
             total_hours: number; gross_pay: number }[],
): { totalRegular: number; totalOvertime: number; totalHours: number;
     totalGross: number; averageGross: number }
```
- Sum each column; `averageGross = totalGross / count` rounded to 2 decimals,
  `0` when there are no records (no division by zero).

### Task 5.2 — Department Report
Add to the same file:
```ts
export function buildDepartmentReport(
  records: { employee_id: number; total_hours: number; gross_pay: number }[],
  employees: { id: number; first_name: string; last_name: string }[],
): { department: string; headcount: number;
     totalHours: number; totalGross: number }[]
```
- Department is derived from the employee's first name, using the dashboard's
  mapping: `Sarah`/`Robert` → Engineering, `Michael` → Design, `Emily` →
  Marketing, `James` → Sales, everyone else → HR.
- Group by department: `headcount` is the number of distinct employees;
  sum hours and gross pay. Sort departments alphabetically.

Build a "Department Report" view on the payroll tab.

### Success Criteria
- [ ] `summarizePayroll` totals correctly and is safe for zero records
- [ ] `buildDepartmentReport` groups by department, counts headcount, sorts

---

## 🏆 Scoring

| Level | Points |
|-------|--------|
| Level 1 | 10 pts |
| Level 2 | 25 pts |
| Level 3 | 45 pts |
| Level 4 | 65 pts |
| Level 5 | 80 pts |

**Bonus:** +20 pts for clean code and helpers actually wired into the dashboard.
**Total:** 225 pts + bonus

---

## 📚 Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Vitest Documentation](https://vitest.dev/)

*Good luck, developer! ⏱️*
