# FlexiSpend — Backend Architecture Plan

## Overview

NestJS + PostgreSQL + Prisma backend API for **FlexiSpend** — a personal finance management platform that lets users track daily income and expenses, organize spending by categories and accounts, set monthly budgets, and view financial reports.

This document describes the planned module layout, data flow, and key architectural decisions **before any code is written**.

---

## High-Level Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                      NestJS Application                      │
│                                                              │
│  ┌─────────┐  ┌──────────────┐  ┌──────────┐  ┌──────────┐ │
│  │  Auth   │  │ Transactions │  │ Budgets  │  │  Admin   │ │
│  │ Module  │  │    Module    │  │  Module  │  │  Module  │ │
│  └────┬────┘  └──────┬───────┘  └────┬─────┘  └────┬─────┘ │
│       │              │               │              │       │
│  ┌────┴────┐  ┌──────┴───────┐  ┌────┴─────┐  ┌────┴─────┐ │
│  │ Users  │  │  Categories  │  │ Accounts │  │ Reports  │ │
│  │ Module │  │    Module    │  │  Module  │  │  Module  │ │
│  └────┬───┘  └──────┬───────┘  └────┬─────┘  └────┬─────┘ │
│       │             │               │              │       │
│       └─────────────┴───────┬───────┴──────────────┘       │
│                             │                               │
│                      ┌──────┴──────┐                        │
│                      │   Prisma    │                        │
│                      │   Module    │                        │
│                      └──────┬──────┘                        │
│                             │                               │
└─────────────────────────────┼───────────────────────────────┘
                              │
                       ┌──────┴──────┐
                       │ PostgreSQL  │
                       └─────────────┘
```

---

## Module Breakdown

### Core Modules

| Module           | Responsibility                            | Public Routes?       |
| ---------------- | ----------------------------------------- | -------------------- |
| **PrismaModule** | Shared database client (global)           | —                    |
| **AuthModule**   | Login, register, JWT issuance, profile    | Yes (login/register) |
| **UsersModule**  | User CRUD for admin; profile lookups      | No                   |

### Domain Modules

| Module                 | Responsibility                                           | Public Routes? |
| ---------------------- | -------------------------------------------------------- | -------------- |
| **AccountsModule**     | Financial account CRUD (cash, bank, e-wallet, credit)    | Auth           |
| **CategoriesModule**   | Income/Expense category CRUD; system defaults            | Auth           |
| **TransactionsModule** | Record income & expenses, search, filter by date/account | Auth           |
| **BudgetsModule**      | Monthly budget CRUD per category, budget-vs-actual       | Auth           |
| **ReportsModule**      | Monthly summary, category breakdown, trends              | Auth / Admin   |

### Shared (Common)

| Item                  | Location             | Purpose                              |
| --------------------- | -------------------- | ------------------------------------ |
| JwtAuthGuard          | `common/guards/`     | Protect authenticated routes         |
| RolesGuard            | `common/guards/`     | Restrict by ADMIN / USER             |
| Roles decorator       | `common/decorators/` | Annotate role requirements           |
| ZodValidationPipe     | `common/pipes/`      | Body validation via Zod schemas      |
| GlobalExceptionFilter | `common/filters/`    | Uniform error responses              |

---

## Request Flow

```
Client Request
     │
     ▼
 Global Prefix (/api)
     │
     ▼
 Controller (route matching)
     │
     ▼
 Guards (JWT → Roles)
     │
     ▼
 Pipes (Zod validation)
     │
     ▼
 Service (business logic)
     │
     ▼
 Prisma (database query)
     │
     ▼
 Response (or ExceptionFilter)
```

---

## Database Schema Plan

### Entities & Relationships

```
User ──< Account
  │          │
  │          └──< Transaction >── Category
  │                                  │
  └──< Budget >─────────────────────┘
```

### Models

#### User
- id (UUID), email (unique), password (hashed), name, role (ADMIN | USER), isActive, timestamps

#### Account
- id (UUID), name (String), type (CASH | BANK | CREDIT_CARD | E_WALLET), balance (Decimal, default 0), currency (String, default "PHP"), isActive, userId (FK), timestamps

#### Category
- id (UUID), name (String), type (INCOME | EXPENSE), icon (String, optional), isDefault (Boolean — system-provided vs user-created), isActive, userId (FK, nullable for system defaults), timestamps

#### Transaction
- id (UUID), amount (Decimal), type (INCOME | EXPENSE), description (String, optional), date (DateTime), accountId (FK), categoryId (FK), userId (FK), timestamps

#### Budget
- id (UUID), amount (Decimal), month (Int, 1–12), year (Int), categoryId (FK), userId (FK), timestamps
- Unique constraint on (userId, categoryId, month, year)

> **Note:** Account balance is updated transactionally whenever a Transaction is created, updated, or deleted. Income increases the balance; expense decreases it.

---

## Authentication Strategy

- **Passport + JWT**
- `POST /api/auth/register` — public user registration
- `POST /api/auth/login`
- `GET /api/auth/me` — protected
- Roles: `ADMIN` and `USER`
- Guards reuse the `JwtAuthGuard` + `RolesGuard` pattern

---

## Folder Structure (Planned)

```
MONEY_TRACKER/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── dto/
│   │   │   ├── login.dto.ts
│   │   │   └── register.dto.ts
│   │   └── strategies/
│   │       └── jwt.strategy.ts
│   ├── accounts/
│   │   ├── accounts.controller.ts
│   │   ├── accounts.service.ts
│   │   ├── accounts.module.ts
│   │   └── dto/
│   │       ├── create-account.dto.ts
│   │       └── update-account.dto.ts
│   ├── categories/
│   │   ├── categories.controller.ts
│   │   ├── categories.service.ts
│   │   ├── categories.module.ts
│   │   └── dto/
│   │       └── create-category.dto.ts
│   ├── transactions/
│   │   ├── transactions.controller.ts
│   │   ├── transactions.service.ts
│   │   ├── transactions.module.ts
│   │   └── dto/
│   │       ├── create-transaction.dto.ts
│   │       └── update-transaction.dto.ts
│   ├── budgets/
│   │   ├── budgets.controller.ts
│   │   ├── budgets.service.ts
│   │   ├── budgets.module.ts
│   │   └── dto/
│   │       ├── create-budget.dto.ts
│   │       └── update-budget.dto.ts
│   ├── reports/
│   │   ├── reports.controller.ts
│   │   ├── reports.service.ts
│   │   └── reports.module.ts
│   ├── common/
│   │   ├── decorators/
│   │   │   └── roles.decorator.ts
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── roles.guard.ts
│   │   └── pipes/
│   │       └── zod-validation.pipe.ts
│   ├── prisma/
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   ├── users/
│   │   ├── users.service.ts
│   │   └── users.module.ts
│   ├── app.module.ts
│   └── main.ts
├── .env.example
├── .gitignore
├── instructions.md
├── levels.md
├── project.md
├── readme.md
├── nest-cli.json
├── package.json
├── tsconfig.json
└── tsconfig.build.json
```

---

## API Route Map (Planned)

### Public Routes

| Method | Route              | Description         |
| ------ | ------------------ | ------------------- |
| POST   | /api/auth/register | User registration   |
| POST   | /api/auth/login    | Login               |

### Authenticated Routes (USER + ADMIN)

| Method | Route                     | Description                                  |
| ------ | ------------------------- | -------------------------------------------- |
| GET    | /api/auth/me              | Current user profile                         |
| GET    | /api/accounts             | List user's accounts                         |
| POST   | /api/accounts             | Create account                               |
| PUT    | /api/accounts/:id         | Update account                               |
| DELETE | /api/accounts/:id         | Soft-delete account                          |
| GET    | /api/categories           | List categories (system + user-created)      |
| POST   | /api/categories           | Create custom category                       |
| PUT    | /api/categories/:id       | Update category                              |
| DELETE | /api/categories/:id       | Soft-delete category                         |
| GET    | /api/transactions         | List transactions (filter by date, account, category, type) |
| POST   | /api/transactions         | Record a transaction                         |
| PUT    | /api/transactions/:id     | Update a transaction                         |
| DELETE | /api/transactions/:id     | Delete a transaction                         |
| GET    | /api/budgets              | List budgets for a given month/year          |
| POST   | /api/budgets              | Set a monthly budget for a category          |
| PUT    | /api/budgets/:id          | Update a budget                              |
| DELETE | /api/budgets/:id          | Delete a budget                              |

### Admin-Only Routes

| Method | Route                         | Description                              |
| ------ | ----------------------------- | ---------------------------------------- |
| GET    | /api/users                    | List all users                           |
| PATCH  | /api/users/:id/deactivate     | Deactivate a user                        |
| GET    | /api/reports/monthly-summary  | Monthly income vs expense summary        |
| GET    | /api/reports/category-breakdown | Spending breakdown by category         |
| GET    | /api/reports/trends           | Income/expense trends over past months   |

---

## Seed Data Plan

| Entity       | Seed Records                                                                                                              |
| ------------ | ------------------------------------------------------------------------------------------------------------------------- |
| Users        | 1 admin (`admin@FlexiSpend.com`), 1 user (`user@FlexiSpend.com`), password: `password123`                                     |
| Categories   | **System defaults** — Income: Salary, Freelance, Investment, Other Income · Expense: Food, Transport, Utilities, Shopping, Entertainment, Health, Education, Other Expense |
| Accounts     | For user: Cash Wallet (₱5,000), BDO Savings (₱25,000), GCash (₱3,500)                                                   |
| Transactions | 15–20 sample transactions across the past 30 days (mix of income & expense)                                               |
| Budgets      | 3–4 monthly budgets for the current month (e.g., Food ₱8,000, Transport ₱3,000, Entertainment ₱2,000)                    |

---

## Non-Functional Notes

- **Global prefix:** `/api` (set in `main.ts`)
- **CORS:** enabled for all origins (development)
- **Validation:** Zod schemas in each `dto/` folder, applied via `ZodValidationPipe`
- **Error handling:** `GlobalExceptionFilter` returns consistent `{ statusCode, message, error }` shape
- **Decimal handling:** Use `Decimal(10,2)` for all money fields in Prisma
- **Transactions:** Account balance updates must use Prisma interactive transactions to stay consistent
