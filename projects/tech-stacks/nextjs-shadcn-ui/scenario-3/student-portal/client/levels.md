# Student Portal – Developer Challenge Levels

Welcome to the Student Portal project! You've joined the team responsible for the student-facing academic dashboard, built with Next.js and shadcn/ui. Complete the levels below to demonstrate your frontend development skills.

For this scenario, the demo student credentials are:

| Role    | Student ID | Password |
| ------- | ---------- | -------- |
| Student | 12-346-78  | sample   |

---

## 🎮 Level 1: Setup & Simple UI Fixes
**Difficulty: ⭐ Easy**
**Estimated Time: 30 minutes**

### Scenario
The school has onboarded a new developer (you!) and needs the system running locally with environment configuration and minor UI tweaks before the next semester roster is published.

### Tasks

#### Task 1.1: Environment Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment variables by creating a `.env.local` file at [`.env.local`](.env.local:1):
   ```
   NEXT_PUBLIC_SCHOOL_NAME=Riverside University
   NEXT_PUBLIC_REGISTRAR_EMAIL=registrar@riverside.edu
   NEXT_PUBLIC_ACADEMIC_YEAR=2025-2026
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open http://localhost:3000 and verify the app loads.
5. Replace the hard-coded **"Student Portal"** brand label in the dashboard header ([`src/app/dashboard/layout.tsx`](src/app/dashboard/layout.tsx:49)) and the login page heading ([`src/app/login/page.tsx`](src/app/login/page.tsx:37)) with the value from `NEXT_PUBLIC_SCHOOL_NAME`.

#### Task 1.2: UI Text Updates
1. Change the login submit button label from **"Sign In"** to **"Log In"**:
   - File: [`src/app/login/page.tsx`](src/app/login/page.tsx:79)
   - The loading state text **"Signing in..."** should become **"Logging in..."**
2. Update the login card description from **"Sign in to access your academic information"** to **"Log in to access your academic information"**:
   - File: [`src/app/login/page.tsx`](src/app/login/page.tsx:38)
3. Replace the hard-coded academic year in the fees page summary card subtitle ([`src/app/dashboard/fees/page.tsx`](src/app/dashboard/fees/page.tsx:55)) with the value from `NEXT_PUBLIC_ACADEMIC_YEAR`.

### Success Criteria
- [ ] App runs without errors on `npm run dev`
- [ ] `.env.local` file is properly configured
- [ ] Brand label on login + dashboard header reflects `NEXT_PUBLIC_SCHOOL_NAME`
- [ ] Login button reads "Log In" / "Logging in..."
- [ ] Login description uses "Log in"
- [ ] Fees page subtitle uses `NEXT_PUBLIC_ACADEMIC_YEAR`

---

## 🎮 Level 2: Bug Fixing & Refactoring
**Difficulty: ⭐⭐ Medium**
**Estimated Time: 1 hour**

### Scenario
The dean's office reports that grade badges are visually noisy and inconsistent across pages, and that similar stat-card components are duplicated in nearly every dashboard view.

### Tasks

#### Task 2.1: Fix Grade Badge Colors
**Bug:** The grades page uses the default shadcn variants (`success`, `warning`, `secondary`, `destructive`) which produce inconsistent contrast. The team wants explicit, accessible Tailwind palettes per grade tier.

- File: [`src/app/dashboard/grades/page.tsx`](src/app/dashboard/grades/page.tsx:39)
- Replace `getGradeColor` so each tier maps to a distinct, accessible palette via a `className` (still pass through the existing `Badge` component, but apply these classes):
  - `A`-tier (`A`, `A-`) → `bg-green-100 text-green-800`
  - `B`-tier (`B+`, `B`, `B-`) → `bg-blue-100 text-blue-800`
  - `C`-tier (`C+`, `C`, `C-`) → `bg-yellow-100 text-yellow-800`
  - `D`/`F`-tier → `bg-red-100 text-red-800`

#### Task 2.2: Refactor & Extract Component
1. Create a reusable [`StatCard`](src/components/StatCard.tsx:1) component:
   - Move the repeated stat-card JSX (the small `Card` with title, icon, big number, and `text-muted-foreground` subtitle) from [`src/app/dashboard/page.tsx`](src/app/dashboard/page.tsx:30), [`src/app/dashboard/fees/page.tsx`](src/app/dashboard/fees/page.tsx:48), [`src/app/dashboard/schedule/page.tsx`](src/app/dashboard/schedule/page.tsx:16), and [`src/app/dashboard/standing/page.tsx`](src/app/dashboard/standing/page.tsx:73) into this component.
   - Accept props: `title`, `value`, `subtitle`, `icon` (a `LucideIcon`), and an optional `valueClassName` so the destination page can color the number.
   - Update all four pages to use `<StatCard ... />`.
2. Refactor the three back-to-back `tuitionFees.filter(...)` calls in [`src/app/dashboard/fees/page.tsx`](src/app/dashboard/fees/page.tsx:9-15) into a single `useMemo` returning `{ paid, pending, overdue, totals: { paid, pending, overdue, grand } }`.

### Success Criteria
- [ ] Grade badges render with the new palette across A, B, C, and D/F tiers
- [ ] `StatCard` component exists at `src/components/StatCard.tsx` and is used in dashboard, fees, schedule, and standing pages
- [ ] Fees page derives all fee tallies from a single `useMemo`

---

## 🎮 Level 3: Feature Development
**Difficulty: ⭐⭐⭐ Hard**
**Estimated Time: 2–3 hours**

### Scenario
Students are asking for two things: a faster way to find an old grade, and a way to write down personal study notes per course without leaving the portal.

### Tasks

#### Task 3.1: Grade Search & Semester Filter
1. In [`src/app/dashboard/grades/page.tsx`](src/app/dashboard/grades/page.tsx:1), add a search input above the "Course Grades" card (placeholder: "Search grades...").
2. Filter the rows in the **All Semesters** tab by either:
   - `courseCode` (case-insensitive), OR
   - `courseName` (case-insensitive)
3. Add a row of filter chips above the table — `All` / `1st Semester` / `2nd Semester` — that combines with the search.
4. When no rows match, show **"No grades found"** inside the table card body.

#### Task 3.2: Student Notes Page
1. Create [`src/app/dashboard/notes/page.tsx`](src/app/dashboard/notes/page.tsx:1).
2. Read past notes from `localStorage` under key `"studentNotes"` (an array of `{ id, courseCode, content, createdAt }`).
3. Display them in a card list with the course code, content, and a formatted `createdAt`.
4. Show **"No notes yet"** when the list is empty.
5. Add a textarea + "Add Note" button at the top of the page for entering a new note (course code + content). Pushing **Add Note** appends the new note to `studentNotes` in `localStorage` with a generated `id` and `createdAt = new Date().toISOString()`.
6. Add a "Notes" link to the dashboard sidebar in [`src/app/dashboard/layout.tsx`](src/app/dashboard/layout.tsx:10) (icon: `StickyNote` from `lucide-react`, href: `/dashboard/notes`).

### Success Criteria
- [ ] Search input filters grade rows by course code or name in real-time
- [ ] Semester filter chips combine correctly with the search input
- [ ] "No grades found" message renders when filters yield zero results
- [ ] Notes page lists previously saved notes from `localStorage`
- [ ] Submitting the new-note form persists a new entry
- [ ] Sidebar exposes a Notes link to `/dashboard/notes`

---

## 🎮 Level 4: Integration & Edge Cases
**Difficulty: ⭐⭐⭐⭐ Expert**
**Estimated Time: 2–3 hours**

### Scenario
QA flagged that the login screen accepts garbage and that the sidebar collapses back to its default state every page reload, which annoys students who prefer a compact view.

### Tasks

#### Task 4.1: Login Form Validation
In [`src/app/login/page.tsx`](src/app/login/page.tsx:1), enforce these rules on the login form:

1. `studentId` must match exactly the format `^\d{2}-\d{3}-\d{2}$` (e.g., `12-346-78`).
2. `password` must be at least 6 characters.
3. On invalid input, show an inline error message under the offending field (e.g. `"Student ID must be in format XX-XXX-XX"`) and disable the **Log In** button.
4. After submit, if the credentials don't match the demo (`12-346-78` / `sample`), show an inline error **"Invalid student ID or password"** above the form and stay on the login page.

#### Task 4.2: localStorage Persistence
1. Create a custom hook in [`src/hooks/useLocalStorage.ts`](src/hooks/useLocalStorage.ts:1):
   ```ts
   export function useLocalStorage<T>(key: string, initialValue: T): [T, (v: T) => void]
   ```
   It should hydrate from `localStorage` on mount and persist on every set.
2. In [`src/app/dashboard/layout.tsx`](src/app/dashboard/layout.tsx:1):
   - Persist the `sidebarOpen` boolean under `"sidebarOpen"` so the user's preference survives page reloads.
3. In [`src/app/dashboard/notes/page.tsx`](src/app/dashboard/notes/page.tsx:1) (from Level 3 Task 3.2):
   - Replace direct `localStorage.getItem("studentNotes")` / `localStorage.setItem(...)` with `useLocalStorage("studentNotes", [])`.
4. In [`src/app/login/page.tsx`](src/app/login/page.tsx:1):
   - Persist the last successfully entered `studentId` under `"lastStudentId"` so it pre-fills on next visit.

### Success Criteria
- [ ] Log In button is disabled until both fields are valid
- [ ] Inline error messages appear for each failing field
- [ ] Wrong credentials show the "Invalid student ID or password" error
- [ ] Sidebar open/closed preference survives reload
- [ ] Notes survive reload via the new hook
- [ ] Last successful student ID survives reload and pre-fills the login form

---

## 🎮 Level 5: Real Client Issue
**Difficulty: ⭐⭐⭐⭐⭐ Master**
**Estimated Time: 3–4 hours**

### Issue Report
> "Students complain that their **cumulative GPA** on the dashboard never matches the one on the grades page — and the academic standing page is showing a hard-coded 3.67 even after we updated their grades. Also, the fees page just shows raw ISO due dates; we'd like that to read 'Due in 5 days' / 'Overdue by 2 days' / 'Due Today' instead."

### Tasks

#### Task 5.1: Fix GPA + Standing Sync Bug
1. In [`src/lib/mockData.ts`](src/lib/mockData.ts:1), export a function `computeCumulativeGPA(grades: Grade[]): number` that uses the same grade-points map as the grades page (`A` = 4.0, `A-` = 3.7, `B+` = 3.3, `B` = 3.0, `B-` = 2.7, `C+` = 2.3, `C` = 2.0, `C-` = 1.7, `D+` = 1.3, `D` = 1.0, `F` = 0.0) and weights by `units`.
2. In [`src/app/dashboard/standing/page.tsx`](src/app/dashboard/standing/page.tsx:1):
   - Replace the hard-coded `currentStanding.gpa` displays with `computeCumulativeGPA(grades)` — the standing card, the GPA stat card, and the GPA-status helper input must all use the computed value.
3. In [`src/app/dashboard/page.tsx`](src/app/dashboard/page.tsx:1):
   - Replace the `currentStanding.gpa` reference in the "Current GPA" stat with the computed cumulative GPA so the dashboard never drifts from the grades page.
4. The grades page's "Cumulative GPA" card must now read from the same `computeCumulativeGPA` helper instead of its inline `getAllTimeGPA` (delete the duplicated helper).

#### Task 5.2: Date Utilities & Documentation
1. Create [`src/lib/dateUtils.ts`](src/lib/dateUtils.ts:1) exporting:
   - `formatDueDate(date: Date | string): string` — `"Due Today"` (same calendar day), `"Due Tomorrow"` (1 day in the future), `"Due in N days"` (2..7 days in the future), `"Overdue by N days"` (any past date), otherwise the locale date string.
   - `isOverdue(date: Date | string): boolean` — returns `true` when `date` is strictly in the past (calendar-day comparison).
   - `daysUntilDue(date: Date | string): number` — positive for future dates, negative for past dates, `0` for today. Computed in whole calendar days.
   - All three must return safe values for invalid input (`""` for the string, `false` for `isOverdue`, `0` for `daysUntilDue`).
2. Replace the inline `formatDate` helper in [`src/app/dashboard/fees/page.tsx`](src/app/dashboard/fees/page.tsx:31) with `formatDueDate` from the new module — pending and overdue rows should now read "Due in N days" / "Overdue by N days".
3. Update [`README.md`](README.md:1) with:
   - Project overview (Riverside University student portal)
   - Demo credentials (`12-346-78` / `sample`)
   - How to run the dev server
   - List of routes (`/`, `/login`, `/dashboard`, `/dashboard/grades`, `/dashboard/schedule`, `/dashboard/fees`, `/dashboard/standing`, `/dashboard/notes`)

### Success Criteria
- [ ] `computeCumulativeGPA` is exported from `src/lib/mockData.ts`
- [ ] Standing, dashboard, and grades pages all show the same cumulative GPA
- [ ] `dateUtils.ts` exports the three functions with correct behavior
- [ ] Fees page uses `formatDueDate` instead of the local helper
- [ ] `README.md` documents the project, credentials, dev workflow, and routes

---

## 🏆 Scoring

| Level | Points |
|-------|--------|
| Level 1 | 10 pts |
| Level 2 | 25 pts |
| Level 3 | 40 pts |
| Level 4 | 60 pts |
| Level 5 | 75 pts |

**Bonus:** +20 pts for clean code, component organization, and comprehensive tests.

**Total:** 210 pts + bonus

---

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [React Hooks Reference](https://react.dev/reference/react)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

*Good luck, developer! The students are counting on you. 🎓📚*
