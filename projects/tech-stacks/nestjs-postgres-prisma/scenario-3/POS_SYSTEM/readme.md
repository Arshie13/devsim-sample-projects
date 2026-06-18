# POS System - Backend API

NestJS + PostgreSQL + Prisma backend for the POS System.

## Tech Stack

- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type safety
- **Prisma** - ORM
- **PostgreSQL** - Database
- **Zod** - Schema validation
- **JWT (JSON Web Tokens)** - Authentication
- **Bcrypt** - Password hashing
- **Passport** - Authentication middleware

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL installed and running

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/pos_system?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-me"
JWT_EXPIRES_IN="1d"
PORT=3000
```

### Installation

```bash
# Install dependencies
pnpm install

# Generate Prisma client
pnpm run prisma:generate

# Run database migrations
pnpm run prisma:migrate

# Seed the database with sample data
pnpm run prisma:seed

# Start development server
pnpm run start:dev
```

The server will run on `http://localhost:3000/api` (or the port specified in .env).

### Available Scripts

- `pnpm run start:dev` - Start development server with hot reload
- `pnpm run build` - Compile TypeScript to JavaScript
- `pnpm run start:prod` - Start production server
- `pnpm run test` - Run all tests
- `pnpm run test:watch` - Run tests in watch mode
- `pnpm run test:tasks:l1` - Run Level 1 tests only
- `pnpm run test:tasks:l2` - Run Level 2 tests only
- `pnpm run test:tasks:l3` - Run Level 3 tests only
- `pnpm run test:tasks:l4` - Run Level 4 tests only
- `pnpm run test:tasks:l5` - Run Level 5 tests only
- `pnpm run prisma:generate` - Generate Prisma client
- `pnpm run prisma:migrate` - Run Prisma migrations
- `pnpm run prisma:seed` - Seed database with sample data
- `pnpm run prisma:studio` - Open Prisma Studio to view database

## Project Structure

```
POS_SYSTEM/
├── prisma/
│   ├── schema.prisma   # Database schema definition
│   └── seed.ts         # Database seeding script
├── src/
│   ├── auth/           # Authentication module
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── dto/        # Data transfer objects
│   │   └── strategies/ # Passport strategies
│   ├── categories/     # Category management module
│   ├── common/         # Shared utilities
│   │   ├── decorators/ # Custom decorators
│   │   ├── filters/    # Exception filters
│   │   ├── guards/     # Auth & role guards
│   │   └── pipes/      # Validation pipes
│   ├── inventory/      # Inventory management module
│   ├── orders/         # Order processing module
│   ├── prisma/         # Prisma service module
│   ├── products/       # Product management module
│   ├── receipts/       # Receipt generation module
│   ├── reporting/      # Sales reporting module
│   ├── settings/       # System settings module
│   ├── users/          # User management module
│   ├── app.module.ts   # Root application module
│   └── main.ts         # Application entry point
├── .env                # Environment variables
├── package.json
└── tsconfig.json
```

## Features & API Routes

All routes are prefixed with `/api`

### 1. **Authentication** (`/api/auth`)
   - `POST /api/auth/login` - Login (Admin/Cashier)
   - `GET /api/auth/me` - Get current user profile 🔒

### 2. **Products** (`/api/products`)
   - `POST /api/products` - Create product 🔒👑
   - `GET /api/products` - List all products with optional search 🔒
   - `GET /api/products/:id` - Get product by ID 🔒
   - `PUT /api/products/:id` - Update product 🔒👑
   - `PATCH /api/products/:id/deactivate` - Deactivate product 🔒👑

### 3. **Categories** (`/api/categories`)
   - `POST /api/categories` - Create category 🔒👑
   - `GET /api/categories` - List all categories 🔒
   - `GET /api/categories/:id` - Get category by ID 🔒
   - `DELETE /api/categories/:id` - Soft delete category 🔒👑

### 4. **Inventory** (`/api/inventory`)
   - `PUT /api/inventory/:productId` - Update stock levels 🔒👑
   - `GET /api/inventory/low-stock` - Get low stock products 🔒
   - `GET /api/inventory/:productId` - Get inventory for product 🔒

### 5. **Orders** (`/api/orders`)
   - `POST /api/orders` - Create new order (checkout) 🔒
   - `GET /api/orders` - View order history 🔒
   - `GET /api/orders/daily` - Get daily sales 🔒
   - `GET /api/orders/:id` - Get order by ID 🔒

### 6. **Receipts** (`/api/receipts`)
   - `GET /api/receipts/:orderId` - Generate receipt for order 🔒

### 7. **Reporting** (`/api/reports`)
   - `GET /api/reports/daily` - Daily sales report 🔒👑
   - `GET /api/reports/weekly` - Weekly sales report 🔒👑

### 8. **Settings** (`/api/settings`)
   - `GET /api/settings` - Get store settings 🔒
   - `PUT /api/settings` - Update store settings 🔒👑

**Legend:**
- 🔒 = Requires authentication (JWT token)
- 👑 = Admin role required

## Testing with Postman

### Setup
1. **Create Environment Variables in Postman:**
   - `baseUrl` = `http://localhost:3000/api`
   - `token` = (empty, will be set automatically)

2. **Login Request:**
   ```
   POST {{baseUrl}}/auth/login
   Body (JSON):
   {
     "email": "admin@ippo.com",
     "password": "password123"
   }
   ```
   
   **Tests Tab:** Add this script to auto-save the token:
   ```javascript
   pm.environment.set("token", pm.response.json().access_token);
   ```

3. **For Protected Routes:**
   Add header: `Authorization: Bearer {{token}}`

### Sample Test Users (from seed data)
- **Admin:** email: `admin@ippo.com`, password: `password123`
- **Cashier:** email: `cashier@ippo.com`, password: `password123`

### Smoke Test Sequence
1. Login as admin
2. GET /auth/me
3. GET /categories
4. GET /products
5. POST /orders (create order with existing product IDs)
6. GET /orders
7. GET /receipts/:orderId
8. GET /reports/daily

## Database Schema

The system uses the following main entities:
- **Users** - Admin and Cashier roles
- **Categories** - Product categories
- **Products** - Product catalog with SKU
- **Inventory** - Stock tracking with low-stock alerts
- **Orders** - Sales transactions with order items
- **Settings** - Store configuration (tax rate, payment methods)

See [prisma/schema.prisma](prisma/schema.prisma) for the complete schema definition.

---

## 🧩 Task — Test Mapping

Use this table to find the test file that validates each challenge task.

| Level | Task | Title | Test File |
| ----- | ---- | ----- | --------- |
| 1 | 1 | Environment Setup | `tests/server/level-1/task-1/environment-bootstrap.test.ts` |
| 1 | 2 | Add `phoneNumber` to Store Settings | `tests/server/level-1/task-2/store-settings-phone-field.test.ts` |
| 2 | 1 | Inventory Integrity Guards | `tests/server/level-2/task-1/inventory-integrity.test.ts` |
| 2 | 2 | Paginated Product Listing | `tests/server/level-2/task-2/products-pagination.test.ts` |
| 3 | 1 | Transactional Checkout: Tax, Discount & Inventory | `tests/server/level-3/task-1/checkout-tax-discount-inventory.test.ts` |
| 3 | 2 | Payment Method Validation | `tests/server/level-3/task-2/payment-method-validation.test.ts` |
| 4 | 1 | Daily Sales Report | `tests/server/level-4/task-1/sales-report-daily.test.ts` |
| 4 | 2 | Weekly Sales Report | `tests/server/level-4/task-2/sales-report-weekly.test.ts` |
| 5 | 1 | Fix Oversell, Decimal Drift & Timezone | `tests/server/level-5/task-1/concurrency-decimals-timezone.test.ts` |
| 5 | 2 | Write Postmortem Document | `tests/server/level-5/task-2/postmortem-document.test.ts` |

> **Test DB setup:** Copy `.env.example` to `.env`, set `DATABASE_URL_TEST` to a separate Postgres database, then run `pnpm run test`.
