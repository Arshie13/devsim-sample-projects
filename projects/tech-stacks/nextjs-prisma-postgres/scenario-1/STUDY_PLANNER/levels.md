# StudyPlanner — Frontend Developer Challenge Levels

Welcome to StudyPlanner! You've been hired as a frontend developer to build and enhance the StudyPlanner app — a tool that helps students organize subjects and track tasks with deadlines.

The five levels below form a **gradual ramp**: Level 1 is a gentle onboarding step, and each level after it is meaningfully harder than the last. Finish them in order.

Every level has **two tasks**, and each task is tagged **[Server]** (API routes, Prisma schema, data layer) or **[Client]** (pages, components, UI). Levels mix the two — some pair one of each, some are two of a kind.

> **Theme of this scenario:** organizing and surfacing study work — search, calendars, reminders, and insights.

---

## 🎮 Level 1: Onboarding & First Change
**Difficulty: ⭐ Easy**
**Estimated Time: 30 minutes**
**Points: 10**
**Mix: 1 Server · 1 Client**

### Scenario
You just cloned the StudyPlanner repository. Get it running locally, then make one small, safe change to prove your environment works.

### Tasks

#### Task 1.1 — [Server] Get the Project Running & Add a Health Route
1. Install dependencies (`npm install`)
2. Copy `.env.example` to `.env` and fill in the database URL
3. Start PostgreSQL with Docker (`docker-compose up -d`)
4. Generate the Prisma client and push the schema (`npx prisma generate`, `npm run db:push`)
5. Seed the database (`npm run db:seed`) and start the dev server (`npm run dev`)
6. Add a health-check route at `src/app/api/health/route.ts` that responds to `GET` with `{ status: "ok" }`

#### Task 1.2 — [Client] Highlight Overdue Tasks
On the homepage (`src/app/page.tsx`), visually flag any task whose `deadline` is in the past and not completed.
- Compare each task's deadline against the current date
- Give overdue tasks a distinct style (e.g. red text or an "Overdue" label)

### Success Criteria
- [ ] App runs without errors and `GET /api/health` returns `{ status: "ok" }`
- [ ] Overdue tasks are visually distinct on the homepage

---

## 🎮 Level 2: Task Search & Filtering
**Difficulty: ⭐⭐ Medium**
**Estimated Time: 1–1.5 hours**
**Points: 20**
**Mix: 1 Server · 1 Client**

### Scenario
Students with many tasks need to find them quickly. Add server-side filtering and search, then wire the UI to it.

### Tasks

#### Task 2.1 — [Server] Filtering & Search API
Extend `GET /api/tasks` to read query parameters and build a Prisma `where` clause:
- `?subjectId=` — only tasks for that subject
- `?completed=true|false` — only completed or pending tasks
- `?search=` — case-insensitive partial match on the task title (`contains`, `mode: "insensitive"`)
- All parameters must combine into a single `where` clause

#### Task 2.2 — [Client] Filter & Search Controls
On the homepage, add the UI that drives the API:
- A subject filter dropdown
- A pending/completed status filter
- A search input
- Send the selected filters to `GET /api/tasks` as query parameters

### Success Criteria
- [ ] Tasks can be filtered by subject, status, and title search via the API
- [ ] The homepage controls send all active filters to the API together

---

## 🎮 Level 3: Deadline Calendar View
**Difficulty: ⭐⭐⭐ Hard**
**Estimated Time: 2–3 hours**
**Points: 35**
**Mix: 2 Client**

### Scenario
A flat list doesn't show students *when* work is due. Build a calendar that lays tasks out by deadline date — this is a pure front-end level.

### Tasks

#### Task 3.1 — [Client] Build a Month Calendar Page
Create `src/app/calendar/page.tsx`:
- Render a month grid (7 columns, one per weekday)
- Show the current month name and year
- Provide previous / next month navigation

#### Task 3.2 — [Client] Show Tasks on Calendar Dates
- Display an indicator (dot/count) on each date that has tasks due
- Clicking a date reveals the tasks due that day
- Allow creating a new task pre-filled with the clicked date's deadline

### Success Criteria
- [ ] Calendar renders a navigable month grid
- [ ] Dates with deadlines show task indicators
- [ ] Tasks can be viewed and added directly from a date cell

---

## 🎮 Level 4: Deadline Reminders & Notifications
**Difficulty: ⭐⭐⭐⭐ Expert**
**Estimated Time: 2.5–3.5 hours**
**Points: 55**
**Mix: 1 Server · 1 Client**

### Scenario
Students miss deadlines they can't see coming. Build a notification system that warns them about upcoming due dates.

### Tasks

#### Task 4.1 — [Server] Notification Model & Reminders API
- Add a `Notification` model to the schema (`message`, `read` boolean, `type`, `createdAt`, link to a task)
- Create `src/app/api/notifications/route.ts` — `GET` lists notifications, `POST` creates one
- Implement reminder logic that generates notifications for tasks due within 1 / 3 / 7 days
- Add `src/app/api/notifications/[id]/route.ts` with `PATCH` to mark a notification read

#### Task 4.2 — [Client] Notifications Page & Unread Badge
- Create `src/app/notifications/page.tsx` listing notifications, newest first
- Show an unread-count badge in the app layout/header
- Provide a "mark as read" action per notification

### Success Criteria
- [ ] Notifications are generated for upcoming deadlines and can be marked read
- [ ] The notifications page lists them and an unread badge reflects the count

---

## 🎮 Level 5: Study Analytics Dashboard
**Difficulty: ⭐⭐⭐⭐⭐ Master**
**Estimated Time: 3.5–5 hours**
**Points: 80**
**Mix: 1 Server · 1 Client**

### Scenario
Students want to understand their study habits. Build an analytics layer that aggregates their data and visualizes it.

### Tasks

#### Task 5.1 — [Server] Analytics Aggregation API
Create `src/app/api/analytics/route.ts` (or `/api/analytics/overview`) that returns:
- Overall completion rate and average task progress
- A per-subject breakdown (task counts, completion rate)
- A completion-rate **trend** grouped by week or month
- Use Prisma aggregation (`count`, `groupBy`, `_avg`) — do not fetch everything and compute in JS

#### Task 5.2 — [Client] Analytics Dashboard
Create `src/app/analytics/page.tsx`:
- Render visual charts (bar/progress) for the per-subject breakdown
- Show the completion-rate trend over time
- Surface percentage-based productivity insights

### Success Criteria
- [ ] Analytics endpoints return accurate aggregated data and a time-based trend
- [ ] The dashboard visualizes per-subject performance and trends
