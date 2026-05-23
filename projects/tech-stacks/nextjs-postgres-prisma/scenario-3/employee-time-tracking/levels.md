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
> finish the task. Each level mixes the kinds of tests you'll see in a real
> Next.js codebase — **server tests** (mocked Prisma server actions) and
> **client tests** (React components rendered with Testing Library).

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

## 🎮 Level 2: Time Calculations (Server)
**Difficulty: ⭐⭐ Medium** · **Estimated Time: 1–1.5 hrs**

Both tasks at this level are **server actions** backed by Prisma. The graders
mock `@/lib/prisma`, so you write real Prisma queries — no DB calls actually
execute in the test.

### Task 2.1 — Employee Status (Server Action)
Create [`src/app/actions/time.ts`](src/app/actions/time.ts) exporting:
```ts
export async function getEmployeeStatusForId(
  employeeId: number,
): Promise<'off' | 'clocked-in' | 'clocked-out'>
```
- Look up the employee's most recent time entry via
  `prisma.timeEntry.findFirst({ where: { employee_id: employeeId } })`.
- No entry → `'off'`. No `clock_out` → `'clocked-in'`. Has a `clock_out` → `'clocked-out'`.

### Task 2.2 — Sum Hours (Server Action)
Add to the same file:
```ts
export async function sumHoursForEmployee(employeeId: number): Promise<number>
```
- Use `prisma.timeEntry.findMany({ where: { employee_id: employeeId } })`.
- Sum the duration (in hours) of completed entries (those with a `clock_out`).
- Ignore open entries. Round the total to 2 decimals. Empty → `0`.

### Success Criteria
- [ ] Both server actions live under `src/app/actions/time.ts`
- [ ] Each one queries Prisma (the test mocks the client, not your code)
- [ ] Hour sums skip open entries and round to two decimals

---

## 🎮 Level 3: Time-Off Logic (Client)
**Difficulty: ⭐⭐⭐ Hard** · **Estimated Time: 2–3 hrs**

Both tasks at this level are **React components**. The graders use
`@testing-library/react` to render the component in jsdom and assert on
its rendered output.

### Task 3.1 — Time-Off Request Form
Create [`src/components/TimeOffRequestForm.tsx`](src/components/TimeOffRequestForm.tsx)
with a default-exported component:
```tsx
export default function TimeOffRequestForm({ onSubmit }: {
  onSubmit: (req: {
    start_date: string; end_date: string; hours: number; request_type: string;
  }) => void;
}): JSX.Element
```
- Render labelled inputs: "Start date", "End date", "Hours", and a "Type"
  `<select>` with options `vacation` / `sick` / `personal` / `unpaid`.
- On submit, when valid (`end_date >= start_date` AND `hours > 0`), call
  `onSubmit` with the typed request.
- When invalid, do NOT call `onSubmit` and render a
  `data-testid="form-error"` element.

### Task 3.2 — Time-Off Balance Panel
Create [`src/components/TimeOffBalance.tsx`](src/components/TimeOffBalance.tsx)
with a default-exported component:
```tsx
export default function TimeOffBalance(props: {
  allowance: number;
  requests: { hours: number; status: 'approved'|'pending'|'rejected';
              request_type: 'vacation'|'sick'|'personal'|'unpaid' }[];
}): JSX.Element
```
- Show three values: `used-hours`, `pending-hours`, `remaining-hours`
  (use `data-testid`).
- `used` = Σ hours of approved, non-unpaid requests.
- `pending` = Σ hours of pending requests.
- `remaining` = `allowance − used`.

### Success Criteria
- [ ] Both components live under `src/components/`
- [ ] `<TimeOffRequestForm />` rejects bad dates / non-positive hours
- [ ] `<TimeOffBalance />` correctly groups approved / pending / remaining

---

## 🎮 Level 4: Payroll Computation (Mixed)
**Difficulty: ⭐⭐⭐⭐ Expert** · **Estimated Time: 2.5–3.5 hrs**

This level mixes one **client component** (Task 4.1) with one **server action**
(Task 4.2).

### Task 4.1 — Hours Breakdown (Client)
Create [`src/components/HoursBreakdown.tsx`](src/components/HoursBreakdown.tsx)
with a default-exported component:
```tsx
export default function HoursBreakdown({ totalHours, threshold }: {
  totalHours: number;
  threshold?: number;
}): JSX.Element
```
- Default threshold: `40`.
- Render the regular (up to threshold) and overtime (above threshold) hours
  with these test ids: `data-testid="regular-hours"`,
  `data-testid="overtime-hours"`.

### Task 4.2 — Gross Pay (Server Action)
Create [`src/app/actions/payroll.ts`](src/app/actions/payroll.ts) exporting:
```ts
export async function computeGrossPayForEmployee(
  employeeId: number,
  regularHours: number,
  overtimeHours: number,
): Promise<number>
```
- Read `hourly_rate` via `prisma.employee.findUnique({ where: { id: employeeId } })`.
- Throw when the employee has no `hourly_rate`.
- Gross = `regular × rate + overtime × rate × 1.5`, rounded to two decimals.

### Success Criteria
- [ ] `<HoursBreakdown />` splits at the default and custom thresholds
- [ ] `computeGrossPayForEmployee` queries Prisma and applies the 1.5× multiplier

---

## 🎮 Level 5: Payroll Reporting (Mixed)
**Difficulty: ⭐⭐⭐⭐⭐ Master** · **Estimated Time: 3–4 hrs**

This level mixes one **client component** (Task 5.1) with one **server action**
(Task 5.2). Build a "Department Report" view on the payroll tab.

### Task 5.1 — Payroll Summary (Client)
Create [`src/components/PayrollSummary.tsx`](src/components/PayrollSummary.tsx)
with a default-exported component:
```tsx
export default function PayrollSummary({ records }: {
  records: { regular_hours: number; overtime_hours: number;
             total_hours: number; gross_pay: number }[];
}): JSX.Element
```
- `data-testid="total-regular"` — Σ `regular_hours`.
- `data-testid="total-overtime"` — Σ `overtime_hours`.
- `data-testid="total-hours"` — Σ `total_hours`.
- `data-testid="total-gross"` — Σ `gross_pay`, dollar-formatted `$X,XXX.XX`.
- `data-testid="average-gross"` — `totalGross / count`, rounded 2dp,
  dollar-formatted (0 when there are no records — no division by zero).

### Task 5.2 — Department Report (Server Action)
Create [`src/app/actions/reports.ts`](src/app/actions/reports.ts) exporting:
```ts
export async function getDepartmentReport(): Promise<{
  department: string;
  headcount: number;
  totalHours: number;
  totalGross: number;
}[]>
```
- Query `prisma.payrollRecord.findMany({ include: { employee: true } })`.
- Department is derived from the employee's first name, using the dashboard's
  mapping: `Sarah`/`Robert` → Engineering, `Michael` → Design, `Emily` →
  Marketing, `James` → Sales, everyone else → HR.
- Group by department: `headcount` = distinct employees; sum hours and gross
  pay. Sort departments alphabetically.

### Success Criteria
- [ ] `<PayrollSummary />` totals correctly and is safe for zero records
- [ ] `getDepartmentReport` groups by department, counts headcount, sorts

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
