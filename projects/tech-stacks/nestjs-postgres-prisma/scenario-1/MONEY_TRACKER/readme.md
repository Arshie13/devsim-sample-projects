# FlexiSpend — Personal Finance Management API

A production-ready REST API built with **NestJS + PostgreSQL + Prisma** for tracking personal finances, managing budgets, and generating financial reports.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 14+
- Git

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your PostgreSQL credentials.

3. **Set up database**
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   npx prisma db seed
   ```

4. **Start the server**
   ```bash
   npm run start:dev
   ```

   API will be available at `http://localhost:3000/api`

---

## 📦 Features

- **Authentication** — JWT-based auth with role-based access control (USER/ADMIN)
- **Accounts** — Manage multiple accounts (cash, bank, credit card, e-wallet)
- **Categories** — System defaults + user custom categories for income/expenses
- **Transactions** — Record, filter, and search income/expense transactions
- **Budgets** — Set monthly budgets per category with real-time tracking
- **Reports** — Monthly summaries, category breakdowns, and trend analysis

---

## 🛠️ Tech Stack

| Layer          | Technology          |
| -------------- | ------------------- |
| Framework      | NestJS 10           |
| Database       | PostgreSQL 14+      |
| ORM            | Prisma 5            |
| Authentication | Passport + JWT      |
| Validation     | Zod                 |
| Language       | TypeScript 5        |

---

## 📚 Documentation

- [**project.md**](project.md) — Full architecture plan and design decisions
- [**levels.md**](levels.md) — Progressive challenge levels (5 levels from Easy to Master)
- [**instructions.md**](instructions.md) — Step-by-step implementation guide

---

## 🧪 Available Scripts

| Command                     | Description                          |
| --------------------------- | ------------------------------------ |
| `npm run start:dev`         | Start dev server with hot reload     |
| `npm run start:prod`        | Start production server              |
| `npm run build`             | Build for production                 |
| `npm run test`              | Run all tests                        |
| `npm run test:watch`        | Run tests in watch mode              |
| `npm run test:tasks:l1`     | Run Level 1 tests only               |
| `npm run test:tasks:l2`     | Run Level 2 tests only               |
| `npm run test:tasks:l3`     | Run Level 3 tests only               |
| `npm run test:tasks:l4`     | Run Level 4 tests only               |
| `npm run test:tasks:l5`     | Run Level 5 tests only               |
| `npm run prisma:migrate`    | Run database migrations              |
| `npm run prisma:generate`   | Generate Prisma client               |
| `npm run prisma:seed`       | Seed database with sample data       |
| `npm run prisma:studio`     | Open Prisma Studio (database GUI)    |
| `npm run lint`              | Lint and fix code                    |
| `npm run format`            | Format code with Prettier            |

---

## 🧩 Task — Test Mapping

Use this table to find the test file that validates each challenge task.

| Level | Task | Title | Test File |
| ----- | ---- | ----- | --------- |
| 1 | 1 | Environment Setup | `tests/server/level-1/task-1/environment-bootstrap.test.ts` |
| 1 | 2 | Add `note` Field to Transaction | `tests/server/level-1/task-2/transaction-note-field.test.ts` |
| 2 | 1 | Paginated & Filterable Transactions | `tests/server/level-2/task-1/transactions-pagination-and-filters.test.ts` |
| 2 | 2 | Fix Soft-Deleted Categories Visibility | `tests/server/level-2/task-2/categories-soft-delete.test.ts` |
| 3 | 1 | Atomic Balance, Funds Guard & Field Validation | `tests/server/level-3/task-1/balance-funds-and-validation.test.ts` |
| 3 | 2 | Budget-vs-Actual Tracking | `tests/server/level-3/task-2/budget-tracking.test.ts` |
| 4 | 1 | Monthly Summary & Trend Reports | `tests/server/level-4/task-1/monthly-summary-and-trends.test.ts` |
| 4 | 2 | Category Breakdown & Budget Alerts | `tests/server/level-4/task-2/category-breakdown-and-alerts.test.ts` |
| 5 | 1 | Fix Balance Drift, Timezone & Div-by-Zero | `tests/server/level-5/task-1/concurrency-timezone-math.test.ts` |
| 5 | 2 | Write Postmortem Document | `tests/server/level-5/task-2/postmortem-document.test.ts` |

> **Test DB setup:** Copy `.env.example` to `.env`, set `DATABASE_URL_TEST` to a separate Postgres database, then run `npm run test`.

---

## 🔐 Default Credentials

After seeding:

| Role  | Email                      | Password      |
| ----- | -------------------------- | ------------- |
| Admin | admin@FlexiSpend.com       | password123   |
| User  | user@FlexiSpend.com        | password123   |

> ⚠️ **Change these in production!**

---

## 📡 API Routes

### Public
- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login and get JWT token

### Authenticated (USER + ADMIN)
- `GET /api/auth/me` — Get current user profile
- `GET /api/accounts` — List accounts
- `POST /api/accounts` — Create account
- `GET /api/transactions` — List transactions (with filters)
- `POST /api/transactions` — Record transaction
- `GET /api/budgets` — List budgets
- `POST /api/budgets` — Create budget

### Admin Only
- `GET /api/reports/monthly-summary` — Monthly income/expense summary
- `GET /api/reports/category-breakdown` — Spending by category
- `GET /api/reports/trends` — Multi-month trends

---

## 🎯 Challenge Levels

Work through progressive challenges to master backend development:

| Level | Difficulty | Points | Focus                                |
| ----- | ---------- | ------ | ------------------------------------ |
| 1     | ⭐ Easy    | 10     | Environment setup & schema update    |
| 2     | ⭐⭐ Medium | 25    | Pagination, filtering & bug fixes    |
| 3     | ⭐⭐⭐ Hard | 40    | Atomic balance updates & validation  |
| 4     | ⭐⭐⭐⭐ Expert | 60 | Reports & analytics                  |
| 5     | ⭐⭐⭐⭐⭐ Master | 75 | Production bug investigation        |

See [levels.md](levels.md) for detailed requirements.

---

## 📝 License

MIT — © 2026 IPPO Software Solutions

---

Built with ❤️ using NestJS
