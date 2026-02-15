# BrewHaven - Backend Architecture Plan

## Overview

NestJS + PostgreSQL + Prisma backend API for the BrewHaven e-commerce platform — a single-merchant online store specializing in artisanal coffee beans, brewing equipment, and accessories sold direct-to-consumer.

This document describes the planned module layout, data flow, and key architectural decisions **before any code is written**.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     NestJS Application                  │
│                                                         │
│  ┌─────────┐  ┌──────────┐  ┌───────────┐  ┌────────┐ │
│  │  Auth   │  │ Products │  │  Orders   │  │ Admin  │ │
│  │ Module  │  │  Module  │  │  Module   │  │ Module │ │
│  └────┬────┘  └────┬─────┘  └─────┬─────┘  └───┬────┘ │
│       │            │              │              │      │
│  ┌────┴────┐  ┌────┴─────┐  ┌────┴──────┐  ┌───┴────┐ │
│  │ Users  │  │Categories│  │  Cart     │  │Reports │ │
│  │ Module │  │  Module  │  │  Module   │  │ Module │ │
│  └────┬───┘  └────┬─────┘  └─────┬─────┘  └───┬────┘ │
│       │           │               │             │      │
│       └───────────┴───────┬───────┴─────────────┘      │
│                           │                             │
│                    ┌──────┴──────┐                      │
│                    │   Prisma    │                      │
│                    │   Module    │                      │
│                    └──────┬──────┘                      │
│                           │                             │
└───────────────────────────┼─────────────────────────────┘
                            │
                     ┌──────┴──────┐
                     │ PostgreSQL  │
                     └─────────────┘
```

---

## Module Breakdown

### Core Modules

| Module         | Responsibility                                 | Public Routes? |
| -------------- | ---------------------------------------------- | -------------- |
| **PrismaModule** | Shared database client (global)              | —              |
| **AuthModule**   | Login, register, JWT issuance, profile       | Yes (login/register) |
| **UsersModule**  | User CRUD for admin; profile lookups         | No             |

### Domain Modules

| Module              | Responsibility                                      | Public Routes? |
| ------------------- | --------------------------------------------------- | -------------- |
| **CategoriesModule** | Category CRUD                                      | Yes (list)     |
| **ProductsModule**   | Product CRUD, search, filtering, image URL mgmt    | Yes (list/detail) |
| **CartModule**       | Server-side cart (optional, or client-only)         | Auth           |
| **OrdersModule**     | Checkout flow, order creation, status management    | Auth / Admin   |
| **ReportsModule**    | Daily/weekly sales, top-selling products            | Admin          |

### Shared (Common)

| Item               | Location               | Purpose                                |
| ------------------ | ---------------------- | -------------------------------------- |
| JwtAuthGuard       | `common/guards/`       | Protect authenticated routes           |
| RolesGuard         | `common/guards/`       | Restrict by ADMIN / CUSTOMER           |
| Roles decorator    | `common/decorators/`   | Annotate role requirements             |
| ZodValidationPipe  | `common/pipes/`        | Body validation via Zod schemas        |
| GlobalExceptionFilter | `common/filters/`   | Uniform error responses                |

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
User ──< Order ──< OrderItem >── Product >── Category
                                   │
                                   └── (stock field on Product)
```

### Models

#### User
- id (UUID), email (unique), password (hashed), name, role (ADMIN | CUSTOMER), isActive, timestamps

#### Category
- id (UUID), name (unique), isActive, timestamps

#### Product
- id (UUID), name, description, price (Decimal), image (URL string), sku (unique), weight (String, e.g. "250g"), roastLevel (String, optional — for coffee beans), stock (Int), isActive, categoryId (FK), timestamps

#### Order
- id (UUID), orderNumber (unique), subtotal, tax, discount, total (all Decimal), status (PENDING | PROCESSING | SHIPPED | DELIVERED | CANCELLED), shippingAddress, paymentMethod (CASH | CARD), userId (FK), timestamps

#### OrderItem
- id (UUID), orderId (FK), productId (FK), quantity, unitPrice, subtotal (all Decimal)

> **Note:** Inventory is embedded as a `stock` field on Product (simpler than a separate Inventory model, matching the single-merchant scope). A separate Inventory model can be introduced in a later level if needed.

---

## Authentication Strategy

- **Passport + JWT** — same pattern as POS_SYSTEM
- `POST /api/auth/register` — new (POS had no public registration)
- `POST /api/auth/login`
- `GET /api/auth/me` — protected
- Roles: `ADMIN` and `CUSTOMER` (vs. POS's ADMIN / CASHIER)
- Guards reuse the same `JwtAuthGuard` + `RolesGuard` pattern

---

## Key Differences from POS_SYSTEM

| Aspect               | POS_SYSTEM                     | ONLINE_ENTERPRISE (BrewHaven)      |
| -------------------- | ------------------------------ | ---------------------------------- |
| User roles           | ADMIN, CASHIER                 | ADMIN, CUSTOMER                    |
| Public routes        | None (fully behind JWT)        | Products & categories are public   |
| Registration         | Seed-only                      | Public customer registration       |
| Order flow           | Cashier scans → immediate sale | Customer checkout with shipping    |
| Order status         | None (completed on creation)   | PENDING → PROCESSING → SHIPPED → DELIVERED |
| Inventory model      | Separate `Inventory` table     | `stock` field on Product           |
| Receipts             | Dedicated module               | Not needed (order confirmation)    |
| Settings             | Store config (tax, payment)    | Not in scope initially             |

---

## Folder Structure (Planned)

```
ONLINE_ENTERPRISE/
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
│   ├── categories/
│   │   ├── categories.controller.ts
│   │   ├── categories.service.ts
│   │   ├── categories.module.ts
│   │   └── dto/
│   │       └── create-category.dto.ts
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
│   ├── orders/
│   │   ├── orders.controller.ts
│   │   ├── orders.service.ts
│   │   ├── orders.module.ts
│   │   └── dto/
│   │       ├── create-order.dto.ts
│   │       └── update-order-status.dto.ts
│   ├── prisma/
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   ├── products/
│   │   ├── products.controller.ts
│   │   ├── products.service.ts
│   │   ├── products.module.ts
│   │   └── dto/
│   │       ├── create-product.dto.ts
│   │       └── update-product.dto.ts
│   ├── reports/
│   │   ├── reports.controller.ts
│   │   ├── reports.service.ts
│   │   └── reports.module.ts
│   ├── users/
│   │   ├── users.service.ts
│   │   └── users.module.ts
│   ├── app.module.ts
│   └── main.ts
├── .env.example
├── .gitignore
├── architecture.md         ← this file
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
| Method | Route                  | Description             |
| ------ | ---------------------- | ----------------------- |
| POST   | /api/auth/register     | Customer registration   |
| POST   | /api/auth/login        | Login                   |
| GET    | /api/products          | List products (search, filter by category) |
| GET    | /api/products/:id      | Product detail          |
| GET    | /api/categories        | List categories         |

### Authenticated Routes (CUSTOMER + ADMIN)
| Method | Route                  | Description             |
| ------ | ---------------------- | ----------------------- |
| GET    | /api/auth/me           | Current user profile    |
| POST   | /api/orders            | Place order (checkout)  |
| GET    | /api/orders            | My orders (customer) / All orders (admin) |
| GET    | /api/orders/:id        | Order detail            |

### Admin-Only Routes
| Method | Route                        | Description                |
| ------ | ---------------------------- | -------------------------- |
| POST   | /api/products                | Create product             |
| PUT    | /api/products/:id            | Update product             |
| PATCH  | /api/products/:id/deactivate | Deactivate product         |
| POST   | /api/categories              | Create category            |
| DELETE | /api/categories/:id          | Soft delete category       |
| PATCH  | /api/orders/:id/status       | Update order status        |
| GET    | /api/reports/daily           | Daily sales report         |
| GET    | /api/reports/weekly          | Weekly sales report        |

---

## Seed Data Plan

| Entity     | Seed Records                                                       |
| ---------- | ------------------------------------------------------------------ |
| Users      | 1 admin (`admin@brewhaven.com`), 1 customer (`customer@brewhaven.com`), password: `password123` |
| Categories | Coffee Beans, Brewing Equipment, Accessories, Gift Sets            |
| Products   | 8-10 items across categories (e.g., Ethiopian Yirgacheffe 250g, Colombian Supremo 500g, Pour-Over Kit, French Press, Ceramic Dripper, Travel Mug, Gift Box Sampler), priced $12-$85, stock 15-60 |
| Orders     | 2-3 sample orders with items                                       |

---

## Non-Functional Notes

- **Global prefix:** `/api` (set in `main.ts`)
- **CORS:** enabled for all origins (development)
- **Validation:** Zod schemas in each `dto/` folder, applied via `ZodValidationPipe`
- **Error handling:** `GlobalExceptionFilter` returns consistent `{ statusCode, message, error }` shape
- **Decimal handling:** Use `Decimal(10,2)` for all money fields in Prisma
- **Transactions:** Order creation must use Prisma interactive transactions to atomically deduct stock
