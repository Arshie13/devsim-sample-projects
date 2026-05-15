# Student Portal – Developer Challenge Levels

Welcome to the Student Portal project! You've joined the team responsible for the student-facing academic dashboard, built with Next.js and shadcn/ui. The five levels below ramp from **gentle warm-ups** to a **realistic master-level sweep** of accessibility and quality work.

For this scenario, the demo student credentials are:

| Role    | Student ID | Password |
| ------- | ---------- | -------- |
| Student | 12-346-78  | sample   |

---

## 🎮 Level 1: Setup & Tinkering
**Difficulty: ⭐ Easy**
**Estimated Time: 20–30 minutes**

### Scenario
You're being onboarded. Get the portal running locally and make a couple of cosmetic tweaks to confirm you know where things live. No business logic yet — just orientation.

### Tasks

#### Task 1.1: Local Setup & Portal Config Module
1. Install dependencies and start the dev server:
   ```bash
   npm install
   npm run dev
   ```
2. Open http://localhost:3000 and confirm the app loads.
3. Create a **plain TypeScript config module** (not env vars) at [`src/lib/portalConfig.ts`](src/lib/portalConfig.ts:1) exporting three named constants:
   ```ts
   export const SCHOOL_NAME = "Riverside University"
   export const SCHOOL_TAGLINE = "Learn. Grow. Graduate."
   export const PORTAL_ACCENT = "blue"
   ```
4. Replace the hard-coded `"Student Portal"` brand label in the dashboard header ([`src/app/dashboard/layout.tsx`](src/app/dashboard/layout.tsx:49)) with the imported `SCHOOL_NAME`.

#### Task 1.2: Dashboard Header Polish
1. In the **login page** ([`src/app/login/page.tsx`](src/app/login/page.tsx:1)), swap the `GraduationCap` icon for the `School` icon from `lucide-react`. The portal heading on the login page should also display `SCHOOL_NAME` (from your new config module) instead of the hard-coded `"Student Portal"`.
2. In the **dashboard page** ([`src/app/dashboard/page.tsx`](src/app/dashboard/page.tsx:1)), the welcome line currently reads:
   ```
   Welcome back, John!
   <program> • <yearLevel>
   ```
   Add a **third line** under the program/year that renders `SCHOOL_TAGLINE` in a small, muted style (`text-sm text-gray-500`).

### Success Criteria
- [ ] `npm run dev` works without errors
- [ ] `src/lib/portalConfig.ts` exists and exports `SCHOOL_NAME`, `SCHOOL_TAGLINE`, `PORTAL_ACCENT`
- [ ] Dashboard header reads "Riverside University" (sourced from `SCHOOL_NAME`)
- [ ] Login page uses the `School` icon and the same `SCHOOL_NAME` heading
- [ ] Dashboard welcome block shows the tagline as a third muted line

---

## 🎮 Level 2: Custom Reusable UI Primitives
**Difficulty: ⭐⭐ Medium**
**Estimated Time: 1–1.5 hours**

### Scenario
The standing badges on the Academic Standing page are confusing — students don't know what "Good" actually requires. And on the grades page, the **All Semesters** tab is one long table that mixes years together. You'll build two small, **hand-rolled** UI primitives (no radix install needed) and put them to use.

### Tasks

#### Task 2.1: InfoTooltip Primitive on Standing Badges
1. Create a small, hover-driven tooltip primitive at [`src/components/InfoTooltip.tsx`](src/components/InfoTooltip.tsx:1):
   ```tsx
   export function InfoTooltip({
     label,
     children,
   }: {
     label: string
     children: React.ReactNode
   }): JSX.Element
   ```
   - Wrap `children` in a `<span class="relative inline-block group">`.
   - Render the label inside a sibling `<span data-testid="info-tooltip" role="tooltip">` that is hidden by default (`opacity-0 pointer-events-none`) and shown on `group-hover` (`group-hover:opacity-100`).
   - Position the tooltip above the trigger (`absolute bottom-full mb-2`).
2. In [`src/app/dashboard/standing/page.tsx`](src/app/dashboard/standing/page.tsx:1), wrap **each** academic-status badge returned by `getStatusBadge` in an `InfoTooltip` whose `label` matches the status:
   - `good` → `"Good Standing: cumulative GPA at or above 3.0."`
   - `warning` → `"Warning: GPA between 2.0 and 2.99 — improve next term."`
   - `probation` → `"Probation: GPA below 2.0 — meet your advisor."`

#### Task 2.2: SemesterGroup Accordion on Grades Page
1. Create a self-contained accordion primitive at [`src/components/SemesterGroup.tsx`](src/components/SemesterGroup.tsx:1):
   ```tsx
   export function SemesterGroup({
     title,
     defaultOpen = false,
     children,
   }: {
     title: string
     defaultOpen?: boolean
     children: React.ReactNode
   }): JSX.Element
   ```
   - Holds an internal `useState` for `open`.
   - Renders a `<button aria-expanded={open}>` whose label is `title` and a chevron rotated by 90° when open (use `ChevronRight` from `lucide-react`).
   - The body wraps `children` and is conditionally rendered when `open` is `true`.
2. In [`src/app/dashboard/grades/page.tsx`](src/app/dashboard/grades/page.tsx:1) inside the **All Semesters** tab, group the rows by `${semester} — ${academicYear}` and render one `<SemesterGroup>` per group. The **first** group should be `defaultOpen`.

### Success Criteria
- [ ] `InfoTooltip` component exists and exposes `role="tooltip"` element
- [ ] Standing page wraps all three status badges with the correct tooltip labels
- [ ] `SemesterGroup` component exists, manages its own open state, and uses `aria-expanded`
- [ ] All Semesters tab on the grades page is split into one accordion per `semester + academicYear`
- [ ] First accordion is open by default; others start closed

---

## 🎮 Level 3: Data Aggregation & Visualization
**Difficulty: ⭐⭐⭐ Hard**
**Estimated Time: 2–3 hours**

### Scenario
Advisors want to see a student's GPA trend over time and visual feedback on their degree progress instead of raw numbers. The data is already in `mockData.ts` — your job is to derive new aggregates and visualize them.

### Tasks

#### Task 3.1: Per-Semester GPA Helper + Card
1. In [`src/lib/mockData.ts`](src/lib/mockData.ts:1), export a pure helper:
   ```ts
   export interface SemesterGPA {
     semester: string
     academicYear: string
     gpa: number
     units: number
   }
   export function computeGPABySemester(gradeList: Grade[]): SemesterGPA[]
   ```
   - Group `grades` by `(semester, academicYear)`.
   - Use this points map: `A=4.0, A-=3.7, B+=3.3, B=3.0, B-=2.7, C+=2.3, C=2.0, C-=1.7, D+=1.3, D=1.0, F=0.0`.
   - Each `gpa` is units-weighted, rounded to 2 decimals.
   - Sort results **chronologically** (older `academicYear` first, then `1st Semester` before `2nd Semester`).
2. In [`src/app/dashboard/standing/page.tsx`](src/app/dashboard/standing/page.tsx:1), add a new **"GPA by Semester"** card below the existing **Degree Progress** card. For each entry returned by `computeGPABySemester(grades)`, render one row with:
   - `${semester} ${academicYear}` on the left
   - The numeric GPA on the right (formatted to 2 decimals)
   - A horizontal bar filling `(gpa / 4.0) * 100%` width, colored `bg-blue-600`

#### Task 3.2: Reusable `<Progress>` Primitive
1. Create a primitive at [`src/components/ui/progress.tsx`](src/components/ui/progress.tsx:1):
   ```tsx
   export function Progress({
     value,
     max = 100,
     className,
   }: {
     value: number
     max?: number
     className?: string
   }): JSX.Element
   ```
   - Outer `<div role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}>` with rounded gray background.
   - Inner filled `<div>` whose width is `${(value / max) * 100}%`.
   - Clamp values outside `[0, max]` so the bar never overflows.
2. Replace the hand-rolled progress bar inside the **Degree Progress** card on the standing page ([`src/app/dashboard/standing/page.tsx`](src/app/dashboard/standing/page.tsx:131-136)) with `<Progress value={earnedCredits} max={totalCredits} />`.
3. On the **dashboard page** ([`src/app/dashboard/page.tsx`](src/app/dashboard/page.tsx:1)), add a new card titled **"Degree Progress"** under the Tuition Summary card showing `<Progress value={earnedCredits} max={totalCredits} />` plus the percentage label.

### Success Criteria
- [ ] `computeGPABySemester` returns one entry per unique `(semester, academicYear)` pair, sorted chronologically
- [ ] GPA values are units-weighted and rounded to 2 decimals
- [ ] Standing page renders the "GPA by Semester" card with one row per semester
- [ ] `<Progress>` exposes `role="progressbar"` with correct `aria-valuenow` / `aria-valuemax`
- [ ] Degree Progress card on the dashboard uses the new `<Progress>` component

---

## 🎮 Level 4: Routing & Multi-Step Workflows
**Difficulty: ⭐⭐⭐⭐ Expert**
**Estimated Time: 2.5–3.5 hours**

### Scenario
Students want a way to drill into a single course (grade + schedule + instructor on one page) and a way to **request official documents** (transcript, enrollment certificate) without emailing the registrar.

### Tasks

#### Task 4.1: Dynamic Course Detail Route
1. Create [`src/app/dashboard/courses/[courseCode]/page.tsx`](src/app/dashboard/courses/[courseCode]/page.tsx:1) as a client component. It receives `{ params: { courseCode: string } }`.
2. The page must:
   - Decode the `courseCode` param (e.g. `CS%20301` → `CS 301`).
   - Look up the matching `Grade` in `grades` (most recent if multiple) and matching `ScheduleItem` in `schedule`.
   - Render a card with: course code, course name, grade (in a `<Badge>`), units, semester, academic year, scheduled day/time/room, and professor.
   - If no grade match exists, render `"Course not found"` and a link back to `/dashboard/grades`.
3. On [`src/app/dashboard/grades/page.tsx`](src/app/dashboard/grades/page.tsx:1), add a final **Actions** column to **both** tab tables. Each row gets a Next.js `<Link>` that reads `"View Details"` and points to `/dashboard/courses/${encodeURIComponent(courseCode)}`.

#### Task 4.2: Multi-Step "Request Document" Modal
1. Build a self-contained modal primitive at [`src/components/ui/modal.tsx`](src/components/ui/modal.tsx:1):
   ```tsx
   export function Modal({
     open,
     onClose,
     children,
   }: {
     open: boolean
     onClose: () => void
     children: React.ReactNode
   }): JSX.Element | null
   ```
   - When `open` is `false`, return `null`.
   - When `open`, render a fixed full-screen overlay with `role="dialog"` and `aria-modal="true"`.
   - Clicking the overlay (not the inner panel) calls `onClose`.
   - The inner panel is white, rounded, max-width `28rem`, centered.
2. Build a new component [`src/components/RequestDocumentDialog.tsx`](src/components/RequestDocumentDialog.tsx:1) that uses `Modal` to walk through **three steps**, managed by internal state:
   - **Step 1 — Choose type**: radio buttons for `"Transcript"`, `"Enrollment Certificate"`, `"Good Moral Certificate"`. A **"Next"** button advances to step 2 (disabled until a type is chosen).
   - **Step 2 — Purpose**: a `<textarea>` for the purpose (placeholder `"e.g. Job application"`). A **"Back"** button returns to step 1; a **"Submit"** button advances to step 3 (disabled until the textarea has ≥10 characters).
   - **Step 3 — Confirmation**: shows a fixed message `"Request submitted!"`, the chosen document type, the purpose, and a generated reference number in the shape `REQ-XXXXXX` (six uppercase alphanumerics). Includes a **"Done"** button that calls `onClose` and resets the internal step back to 1.
3. On [`src/app/dashboard/page.tsx`](src/app/dashboard/page.tsx:1), add a `<Button>Request Document</Button>` near the top of the page (right of the welcome block). Clicking it opens the `RequestDocumentDialog`.

### Success Criteria
- [ ] `/dashboard/courses/[courseCode]` renders details for a known course
- [ ] Unknown course shows `"Course not found"` and a link back to grades
- [ ] Grades page rows include a "View Details" link to `/dashboard/courses/...`
- [ ] `Modal` exposes `role="dialog"` and `aria-modal="true"` and only renders when `open`
- [ ] `RequestDocumentDialog` walks step 1 → 2 → 3 with correct button gating
- [ ] Confirmation step exposes a `REQ-XXXXXX` reference number and the chosen type + purpose

---

## 🎮 Level 5: Real Bug Fix + Accessibility Sweep
**Difficulty: ⭐⭐⭐⭐⭐ Master**
**Estimated Time: 3–4 hours**

### Issue Report
> "QA found two issues that have to ship together. (A) The 'Total Units' and 'Earned Credits' numbers on the Academic Standing page never change when grades are updated — they're frozen at 21 and 78. The dashboard is the same. They should be derived from the grades list. (B) An external accessibility consultant flagged the dashboard for missing landmarks, missing skip link, unlabeled icon buttons, and the sidebar not announcing the current page to screen readers. We can't ship until both are fixed."

### Tasks

#### Task 5.1: Replace Hard-Coded Standing Aggregates
1. In [`src/lib/mockData.ts`](src/lib/mockData.ts:1), export **two** pure helpers:
   ```ts
   export function computeCurrentSemesterUnits(gradeList: Grade[]): number
   export function computeEarnedCredits(gradeList: Grade[]): number
   ```
   - `computeCurrentSemesterUnits` sums `units` of grades whose `(semester, academicYear)` matches `currentStanding.semester` / `currentStanding.academicYear`.
   - `computeEarnedCredits` sums `units` for **every grade that is not `F`** (passing grades only).
2. In [`src/app/dashboard/standing/page.tsx`](src/app/dashboard/standing/page.tsx:1):
   - Replace **every** read of `currentStanding.totalUnits` with `computeCurrentSemesterUnits(grades)`.
   - Replace **every** read of `currentStanding.earnedCredits` with `computeEarnedCredits(grades)`.
   - The `creditsNeeded` and `completionRate` math must use the new computed `earnedCredits`.
3. In [`src/app/dashboard/page.tsx`](src/app/dashboard/page.tsx:1):
   - Replace `currentStanding.totalUnits` in the "Total Units" stat card with `computeCurrentSemesterUnits(grades)`.
   - Replace the `earnedCredits / totalCredits` reference in the Academic Standing card with `computeEarnedCredits(grades) / currentStanding.totalCredits`.

#### Task 5.2: Dashboard Accessibility Sweep
1. In [`src/app/dashboard/layout.tsx`](src/app/dashboard/layout.tsx:1):
   - Add a **"Skip to main content"** link as the **first focusable element** inside the layout root. It must point to `#main-content`, render visually hidden by default (`sr-only`), and become visible on focus (`focus:not-sr-only`).
   - Give the main `<main>` element `id="main-content"` and `tabIndex={-1}` so the skip link works.
   - Add `role="navigation"` and `aria-label="Primary"` to the `<nav>` element inside the sidebar.
   - For each sidebar item, set `aria-current="page"` on the active `<Link>` (or its child `<Button>`) when `pathname === item.href`.
   - Add `aria-label="Toggle sidebar"` to the menu (hamburger) button and `aria-label="Sign out"` to the logout button.
2. The `<header>` element should have `role="banner"` (it has the implicit role already, but state it explicitly so the screen-reader audit passes), and the dashboard header brand text must be exposed via an `<h1 class="sr-only">` that reads the current school name. (Visible brand text stays as-is.)

### Success Criteria
- [ ] `computeCurrentSemesterUnits` and `computeEarnedCredits` exported from `mockData.ts`
- [ ] Standing page Total Units and Earned Credits both reflect the computed values (not the hard-coded 21/78)
- [ ] Dashboard Total Units stat matches the computed current-semester units
- [ ] Skip link is the first focusable element and points to `#main-content`
- [ ] Sidebar `<nav>` exposes `role="navigation"` and `aria-label="Primary"`
- [ ] Active sidebar item has `aria-current="page"`
- [ ] Icon-only buttons (menu, logout) have `aria-label`s
- [ ] Header includes an `sr-only` `<h1>` with `SCHOOL_NAME`

---

## 🏆 Scoring

| Level | Points |
|-------|--------|
| Level 1 | 10 pts |
| Level 2 | 25 pts |
| Level 3 | 45 pts |
| Level 4 | 65 pts |
| Level 5 | 80 pts |

**Bonus:** +20 pts for clean code, component organization, and comprehensive tests.

**Total:** 225 pts + bonus

---

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js Dynamic Routes](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [React Hooks Reference](https://react.dev/reference/react)

---

*Good luck, developer! The students are counting on you. 🎓📚*
