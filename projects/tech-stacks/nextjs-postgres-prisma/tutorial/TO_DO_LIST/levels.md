# To-Do List – Developer Challenge Levels

Welcome to the Next.js + PostgreSQL + Prisma tutorial! This project is a minimal full-stack to-do list app. Once you finish the environment setup below, the app will be fully running with all CRUD features working out of the box.

Each task ships with a graded test under `tests/level-N/task-M/`. A task is complete when its test passes:

```bash
pnpm test:tasks:l1         # run every task in Level 1
pnpm test:task:l1:t1       # run a single task
```

> **Grading rule:** every test fails on the starter code and passes once you finish the task.

---

## 🎮 Level 1: Environment Setup & Orientation
**Difficulty: ⭐ Easy** · **Estimated Time: 20–30 min**

### Scenario
You just cloned the repo. Get the to-do app running against your own PostgreSQL database, then add a small formatting helper.

### Task 1.1 — Environment Setup
1. Install dependencies: `pnpm install`
2. Copy `.env.example` to `.env` and set `DATABASE_URL` to **your own** PostgreSQL connection string.
3. Apply the database migration: `pnpm prisma:migrate deploy`
4. Load the sample data: `pnpm prisma:seed`
5. Start the app: `pnpm dev`

**Graded by** `tests/level-1/task-1/setup-check.test.tsx`, which installs-checks, runs `prisma migrate deploy`, runs a `SELECT 1` + seed-row smoke query via `scripts/db-check.ts`, and verifies the dev environment. Your Postgres password is never read by the test — it only runs your configured environment.

### Task 1.2 — Formatting Helper
Create [`src/lib/format.ts`](src/lib/format.ts) exporting:
```ts
export function formatDate(date: string | Date): string
```
- Returns the date as `YYYY-MM-DD`.
- Handles both `Date` objects and ISO strings.
- Pads single-digit months and days with a leading zero.

Then use `formatDate` in the to-do list page to display creation dates for each task.

### Success Criteria
- [ ] `pnpm dev` works against your own database
- [ ] Schema migrated and seed data inserted
- [ ] The app shows seeded todos and you can add, toggle, and delete tasks
- [ ] `formatDate` exported and used in the UI

---

## 🏆 Scoring

| Level | Points |
|-------|--------|
| Level 1 | 10 pts |

**Bonus:** +5 pts for clean code and helpers actually wired into the UI.
**Total:** 10 pts + bonus

---

## 📚 Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Vitest Documentation](https://vitest.dev/)

*Good luck, developer! ✅*
