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

| Command                  | Description                          |
| ------------------------ | ------------------------------------ |
| `npm run start:dev`      | Start dev server with hot reload     |
| `npm run start:prod`     | Start production server              |
| `npm run build`          | Build for production                 |
| `npm run prisma:migrate` | Run database migrations              |
| `npm run prisma:generate`| Generate Prisma client               |
| `npm run prisma:seed`    | Seed database with sample data       |
| `npm run prisma:studio`  | Open Prisma Studio (database GUI)    |
| `npm run lint`           | Lint and fix code                    |
| `npm run format`         | Format code with Prettier            |

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
