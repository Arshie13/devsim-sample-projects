# Gym Member Portal – Developer Challenge Levels

Welcome to FitTech Systems! You've joined the team behind the gym member
portal, built with **Next.js**, **PostgreSQL** and **Prisma**. The five levels
below ramp from a gentle environment warm-up to a master-level analytics sweep.

Each task ships with a graded test under `tests/level-N/task-M/`. A task is
complete when its test passes:

```bash
pnpm test:tasks:l2         # run every task in Level 2
pnpm test:task:l2:t1       # run a single task
```

> **Grading rule:** every test fails on the starter code and passes once you
> finish the task. Each level mixes the kinds of tests you'll see in a real
> Next.js codebase — **server tests** (mocked Prisma server actions) and
> **client tests** (React components rendered with Testing Library).

---

## 🎮 Level 1: Environment Setup & Orientation
**Difficulty: ⭐ Easy** · **Estimated Time: 20–30 min**

### Scenario
You just cloned the repo. Get the portal running against your own PostgreSQL
database, then add a small formatting helper.

### Task 1.1 — Environment Setup
1. Install dependencies: `pnpm install`
2. Copy `.env.example` to `.env` and set `DATABASE_URL` to **your own**
   PostgreSQL connection string.
3. Create the schema and generate the client: `pnpm prisma:migrate`
4. Load the sample data: `pnpm prisma:seed`
5. Start the app: `pnpm dev`

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
- [ ] `pnpm dev` works against your own database
- [ ] Schema migrated and seed data inserted
- [ ] Both helpers exported and used in the UI

---

## 🎮 Level 2: Membership Logic (Server)
**Difficulty: ⭐⭐ Medium** · **Estimated Time: 1–1.5 hrs**

Both tasks at this level are **server actions** backed by Prisma. The graders
mock `@/lib/prisma`, so you write real Prisma queries — no DB calls actually
execute in the test.

### Task 2.1 — Membership Status (Server Action)
Create [`src/app/actions/membership.ts`](src/app/actions/membership.ts) exporting:
```ts
export async function getMembershipStatusForUser(
  userId: string,
  now?: Date,
): Promise<'active' | 'expired' | 'inactive'>
```
- Use `prisma.membership.findFirst({ where: { user_id: userId } })`.
- `now` past `end_date` → `'expired'`.
- Otherwise `status === 'active'` and `now >= start_date` → `'active'`.
- Anything else (incl. no membership) → `'inactive'`.

### Task 2.2 — Days Until Expiry (Server Action)
Add to the same file:
```ts
export async function getDaysUntilExpiry(
  userId: string,
  now?: Date,
): Promise<number | null>
```
- Look up the user's membership end_date (mocked Prisma).
- Whole days between `now` and `end_date`, floored.
- `0` on the expiry day, negative once expired, `null` when no membership.

### Success Criteria
- [ ] Both server actions live under `src/app/actions/membership.ts`
- [ ] Each one queries Prisma (the test mocks the client, not your code)
- [ ] Status covers active / expired / inactive / not-yet-started

---

## 🎮 Level 3: Class Capacity (Client)
**Difficulty: ⭐⭐⭐ Hard** · **Estimated Time: 2–3 hrs**

Both tasks at this level are **React components**. The graders use
`@testing-library/react` to render the component in jsdom and assert on
its rendered output.

### Task 3.1 — Class Spots Indicator
Create [`src/components/ClassSpotsIndicator.tsx`](src/components/ClassSpotsIndicator.tsx)
with a default-exported component:
```tsx
export default function ClassSpotsIndicator({ capacity, booked }: {
  capacity: number;
  booked: number;
}): JSX.Element
```
- Show "N spots left" (`data-testid="spots-left"`), where N is the remaining
  count — never below zero.
- When `booked >= capacity`, render a `data-testid="full-badge"` element
  containing the text "Class Full". The badge must NOT appear while seats
  remain.

### Task 3.2 — Booking Button
Create [`src/components/BookingButton.tsx`](src/components/BookingButton.tsx)
with a default-exported component:
```tsx
export default function BookingButton(props: {
  classId: number;
  capacity: number;
  booked: number;
  userBookedClassIds: number[];
  onBook: (classId: number) => void;
}): JSX.Element
```
- Default label: "Book". Calls `onBook(classId)` on click when enabled.
- If the user has already booked this class → label "Already booked", disabled.
- Else if the class is full → label "Class full", disabled.
- "Already booked" wins when both conditions are true.

### Success Criteria
- [ ] Both components live under `src/components/`
- [ ] `ClassSpotsIndicator` clamps the count at zero and shows the full badge
- [ ] `BookingButton` resolves the three states in the documented priority

---

## 🎮 Level 4: Booking Aggregation (Mixed)
**Difficulty: ⭐⭐⭐⭐ Expert** · **Estimated Time: 2.5–3.5 hrs**

This level mixes one **client component** (Task 4.1) with one **server action**
(Task 4.2).

### Task 4.1 — Bookings By Class List (Client)
Create [`src/components/BookingsByClassList.tsx`](src/components/BookingsByClassList.tsx)
with a default-exported component:
```tsx
export default function BookingsByClassList(props: {
  bookings: { class_id: number }[];
  classes: { id: number; name: string }[];
}): JSX.Element
```
- Counts bookings per class_id and renders one row per class that has at
  least one booking (`data-testid="booking-row"`). Each row shows the class
  name and the booking count.
- Rows are sorted by class id ascending.
- When there are no bookings, render a `data-testid="empty-state"` element.

### Task 4.2 — Attendance By Month (Server Action)
Create [`src/app/actions/attendance.ts`](src/app/actions/attendance.ts) exporting:
```ts
export async function getAttendanceByMonth(userId: string): Promise<
  { month: string; count: number }[]
>
```
- Query `prisma.attendance.findMany({ where: { user_id: userId } })`.
- Group by `YYYY-MM` (UTC) and return entries sorted ascending by month.
- Return `[]` when there is no attendance.

### Success Criteria
- [ ] `<BookingsByClassList />` groups, sorts, and shows an empty state
- [ ] `getAttendanceByMonth` queries Prisma and buckets results by `YYYY-MM`

---

## 🎮 Level 5: Attendance Analytics (Mixed)
**Difficulty: ⭐⭐⭐⭐⭐ Master** · **Estimated Time: 3–4 hrs**

This level mixes one **client component** (Task 5.1) with one **server action**
(Task 5.2). Build a "Member Insights" page that surfaces both.

### Task 5.1 — Member Stats Card (Client)
Create [`src/components/MemberStatsCard.tsx`](src/components/MemberStatsCard.tsx)
with a default-exported component:
```tsx
export default function MemberStatsCard(props: {
  bookings: { class_id: number }[];
  attendances: { class_id: number }[];
  classes: { id: number; name: string }[];
}): JSX.Element
```
- `data-testid="total-booked"` — `bookings.length`.
- `data-testid="total-attended"` — `attendances.length`.
- `data-testid="attendance-rate"` — `round(totalAttended / totalBooked × 100)`
  formatted as `"N%"` (0% when no bookings).
- `data-testid="favorite-class"` — name of the most-attended class
  (ties → lowest class id). Renders `"—"` when there is no attendance.

### Task 5.2 — Active Members Ranking (Server Action)
Create [`src/app/actions/leaderboard.ts`](src/app/actions/leaderboard.ts)
exporting:
```ts
export async function getActiveMembersRanking(): Promise<{
  user_id: string;
  name: string;
  attendedCount: number;
}[]>
```
- Query `prisma.user.findMany({ include: { attendances: true } })`.
- Project `{ user_id, name: \`${first_name} ${last_name}\`, attendedCount: attendances.length }`.
- Include members with zero attendance.
- Sort by `attendedCount` descending, breaking ties by `name` ascending.

### Success Criteria
- [ ] `<MemberStatsCard />` totals, rates, and favourite class are correct
- [ ] `getActiveMembersRanking` queries Prisma and sorts with the tie-break

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
