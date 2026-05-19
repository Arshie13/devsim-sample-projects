# Gym Member Portal – Developer Challenge Levels

Welcome to FitTech Systems! You've joined the team behind the gym member
portal, built with **Next.js**, **PostgreSQL** and **Prisma**. The five levels
below ramp from a gentle environment warm-up to a master-level analytics sweep.

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
You just cloned the repo. Get the portal running against your own PostgreSQL
database, then add a small formatting helper.

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
export function formatMemberName(first: string, last: string): string
export function formatShortDate(date: string | Date): string
```
- `formatMemberName` joins the trimmed parts with a single space; a missing
  part leaves no stray whitespace.
- `formatShortDate` returns the date as `YYYY-MM-DD`.

Use both in the portal header and membership card.

### Success Criteria
- [ ] `npm run dev` works against your own database
- [ ] Schema migrated and seed data inserted
- [ ] Both helpers exported and used in the UI

---

## 🎮 Level 2: Membership Logic
**Difficulty: ⭐⭐ Medium** · **Estimated Time: 1–1.5 hrs**

### Task 2.1 — Membership Status
Create [`src/lib/membership.ts`](src/lib/membership.ts) exporting:
```ts
export function getMembershipStatus(
  membership: { status: string; start_date: string | Date; end_date: string | Date },
  now: Date,
): 'active' | 'expired' | 'inactive'
```
- `now` past `end_date` → `'expired'`.
- Otherwise `status === 'active'` and `now >= start_date` → `'active'`.
- Anything else → `'inactive'`.

### Task 2.2 — Days Until Expiry
Add to the same file:
```ts
export function daysUntilExpiry(endDate: string | Date, now: Date): number
```
- Whole days between `now` and `endDate`, floored.
- `0` on the expiry day, negative once expired.

Drive the membership card's status badge and "expires in N days" line.

### Success Criteria
- [ ] `getMembershipStatus` covers active / expired / inactive / not-yet-started
- [ ] `daysUntilExpiry` floors partial days and goes negative when expired

---

## 🎮 Level 3: Class Capacity
**Difficulty: ⭐⭐⭐ Hard** · **Estimated Time: 2–3 hrs**

### Task 3.1 — Seat Helpers
Create [`src/lib/classes.ts`](src/lib/classes.ts) exporting:
```ts
export function getAvailableSpots(capacity: number, bookedCount: number): number
export function isClassFull(capacity: number, bookedCount: number): boolean
```
- `getAvailableSpots` never returns a negative number.
- `isClassFull` is `true` once `bookedCount` reaches or exceeds `capacity`.

### Task 3.2 — Booking Guard
Add to the same file:
```ts
export function canBookClass(
  classId: number,
  capacity: number,
  bookedCount: number,
  userBookedClassIds: number[],
): { allowed: boolean; reason: string }
```
- If the user already booked the class → `{ allowed: false, reason: 'Already booked' }`.
- Else if the class is full → `{ allowed: false, reason: 'Class is full' }`.
- Else → `{ allowed: true, reason: '' }`.
- The already-booked check takes precedence over the full check.

Use these in the Class Booking component to gate the "Book" button.

### Success Criteria
- [ ] `getAvailableSpots` and `isClassFull` behave at the boundary
- [ ] `canBookClass` returns the correct reason, already-booked first

---

## 🎮 Level 4: Booking Aggregation
**Difficulty: ⭐⭐⭐⭐ Expert** · **Estimated Time: 2.5–3.5 hrs**

### Task 4.1 — Bookings Per Class
Create [`src/lib/stats.ts`](src/lib/stats.ts) exporting:
```ts
export function countBookingsByClass(
  bookings: { class_id: number }[],
): { class_id: number; count: number }[]
```
- One entry per class id, sorted by `class_id` ascending.

### Task 4.2 — Attendance By Month
Add to the same file:
```ts
export function groupAttendanceByMonth(
  attendances: { attended_at: string | Date }[],
): { month: string; count: number }[]
```
- `month` is `YYYY-MM`; results sorted ascending by month.

Surface both on a new "Class Insights" panel.

### Success Criteria
- [ ] `countBookingsByClass` groups and sorts by class id
- [ ] `groupAttendanceByMonth` buckets by `YYYY-MM` and sorts ascending

---

## 🎮 Level 5: Attendance Analytics
**Difficulty: ⭐⭐⭐⭐⭐ Master** · **Estimated Time: 3–4 hrs**

### Task 5.1 — Member Stats
Add to [`src/lib/stats.ts`](src/lib/stats.ts):
```ts
export function computeMemberStats(
  bookings: { class_id: number }[],
  attendances: { class_id: number }[],
  classes: { id: number; name: string }[],
): { totalBooked: number; totalAttended: number;
     attendanceRate: number; favoriteClassName: string | null }
```
- `attendanceRate` = `round(totalAttended / totalBooked × 100)`, `0` when no bookings.
- `favoriteClassName` = name of the most-attended class (ties → lowest class id),
  `null` when there is no attendance.

### Task 5.2 — Active Member Leaderboard
Add to the same file:
```ts
export function rankActiveMembers(
  members: { user_id: string; first_name: string; last_name: string }[],
  attendances: { user_id: string }[],
): { user_id: string; name: string; attendedCount: number }[]
```
- One row per member (including those with zero attendance).
- `name` is `"first last"`.
- Sorted by `attendedCount` descending, ties broken by `name` ascending.

Build a "Member Insights" page that renders both.

### Success Criteria
- [ ] `computeMemberStats` totals, rates, and favourite class are correct
- [ ] `rankActiveMembers` includes everyone and sorts with the tie-break

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

*Good luck, developer! 🏋️*
