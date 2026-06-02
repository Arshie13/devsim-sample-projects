# BrewHaven - Backend API

NestJS + PostgreSQL + Prisma backend for the BrewHaven E-Commerce Platform.

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
DATABASE_URL="postgresql://postgres:password@localhost:5432/brewhaven?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-me"
JWT_EXPIRES_IN="1d"
PORT=3000
```

### Installation

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Seed the database with sample data
npm run prisma:seed

# Start development server
npm run start:dev
```

The server will run on `http://localhost:3000/api` (or the port specified in .env).

### Available Scripts

- `npm run start:dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm run start:prod` - Start production server
- `npm run test` - Run all tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:tasks:l1` - Run Level 1 tests only
- `npm run test:tasks:l2` - Run Level 2 tests only
- `npm run test:tasks:l3` - Run Level 3 tests only
- `npm run test:tasks:l4` - Run Level 4 tests only
- `npm run test:tasks:l5` - Run Level 5 tests only
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run Prisma migrations
- `npm run prisma:seed` - Seed database with sample data
- `npm run prisma:studio` - Open Prisma Studio to view database

## Project Structure

```
ONLINE_ENTERPRISE/
├── prisma/
│   ├── schema.prisma   # Database schema definition
│   └── seed.ts         # Database seeding script
├── src/
│   ├── auth/           # Authentication module (login, register, JWT)
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── dto/
│   │   └── strategies/
│   ├── categories/     # Category management module
│   ├── common/         # Shared utilities
│   │   ├── decorators/ # Custom decorators (Roles)
│   │   ├── filters/    # Exception filters
│   │   ├── guards/     # Auth & role guards
│   │   └── pipes/      # Validation pipes (Zod)
│   ├── orders/         # Order processing & checkout module
│   ├── prisma/         # Prisma service module
│   ├── products/       # Product management module
│   ├── reports/        # Sales reporting module
│   ├── users/          # User management module
│   ├── app.module.ts   # Root application module
│   └── main.ts         # Application entry point
├── .env                # Environment variables
├── architecture.md     # Technical architecture document
├── levels.md           # Developer challenge levels
├── project.md          # Project requirements & data models
├── package.json
└── tsconfig.json
```

## Features & API Routes

All routes are prefixed with `/api`

### 1. **Authentication** (`/api/auth`)
   - `POST /api/auth/register` - Register new customer
   - `POST /api/auth/login` - Login (Admin/Customer)
   - `GET /api/auth/me` - Get current user profile 🔒

### 2. **Products** (`/api/products`)
   - `GET /api/products` - List all products (public, with search & category filter)
   - `GET /api/products/:id` - Get product by ID (public)
   - `POST /api/products` - Create product 🔒👑
   - `PUT /api/products/:id` - Update product 🔒👑
   - `PATCH /api/products/:id/deactivate` - Deactivate product 🔒👑

### 3. **Categories** (`/api/categories`)
   - `GET /api/categories` - List all categories (public)
   - `GET /api/categories/:id` - Get category by ID (public)
   - `POST /api/categories` - Create category 🔒👑
   - `DELETE /api/categories/:id` - Soft delete category 🔒👑

### 4. **Orders** (`/api/orders`)
   - `POST /api/orders` - Place order (checkout) 🔒
   - `GET /api/orders` - List orders (own for customer, all for admin) 🔒
   - `GET /api/orders/:id` - Get order by ID 🔒
   - `PATCH /api/orders/:id/status` - Update order status 🔒👑

### 5. **Reports** (`/api/reports`)
   - `GET /api/reports/daily` - Daily sales report 🔒👑
   - `GET /api/reports/weekly` - Weekly sales report 🔒👑

**Legend:**
- 🔒 = Requires authentication (JWT token)
- 👑 = Admin role required

## Testing with Postman

### Setup
1. **Create Environment Variables in Postman:**
   - `baseUrl` = `http://localhost:3000/api`
   - `token` = (empty, will be set automatically)

2. **Register a Customer (optional):**
   ```
   POST {{baseUrl}}/auth/register
   Body (JSON):
   {
     "email": "john@example.com",
     "password": "password123",
     "name": "John Doe"
   }
   ```

3. **Login as Admin:**
   ```
   POST {{baseUrl}}/auth/login
   Body (JSON):
   {
     "email": "admin@brewhaven.com",
     "password": "password123"
   }
   ```

   **Tests Tab:** Add this script to auto-save the token:
   ```javascript
   pm.environment.set("token", pm.response.json().access_token);
   ```

4. **For Protected Routes:**
   Add header: `Authorization: Bearer {{token}}`

### Sample Test Users (from seed data)
- **Admin:** email: `admin@brewhaven.com`, password: `password123`
- **Customer:** email: `customer@brewhaven.com`, password: `password123`

### Smoke Test Sequence
1. `GET /products` (public — no auth needed)
2. `GET /categories` (public)
3. `POST /auth/login` (as admin)
4. `GET /auth/me`
5. `POST /products` (create a new coffee product)
6. `POST /auth/register` (register a test customer)
7. `POST /auth/login` (as customer)
8. `POST /orders` (place an order)
9. `GET /orders` (view customer's orders)
10. `POST /auth/login` (as admin again)
11. `PATCH /orders/:id/status` (update to PROCESSING)
12. `GET /reports/daily`

## Database Schema

The system uses the following main entities:
- **Users** - Admin and Customer roles
- **Categories** - Product categories (Coffee Beans, Brewing Equipment, Accessories, Gift Sets)
- **Products** - Product catalog with SKU, weight, and optional roast level
- **Orders** - Customer orders with status tracking (Pending → Processing → Shipped → Delivered)
- **OrderItems** - Line items linking orders to products

See [prisma/schema.prisma](prisma/schema.prisma) for the complete schema definition.
See [architecture.md](architecture.md) for the full technical architecture plan.

---

## 🧩 Task — Test Mapping

Use this table to find the test file that validates each challenge task.

| Level | Task | Title | Test File |
| ----- | ---- | ----- | --------- |
| 1 | 1 | Environment Setup | `tests/server/level-1/task-1/environment-bootstrap.test.ts` |
| 1 | 2 | Add `roastLevel` Field to Product | `tests/server/level-1/task-2/product-roast-level-field.test.ts` |
| 2 | 1 | Paginated & Category-Filterable Products | `tests/server/level-2/task-1/products-pagination-and-filters.test.ts` |
| 2 | 2 | Fix Soft-Deleted Categories Visibility | `tests/server/level-2/task-2/categories-soft-delete.test.ts` |
| 3 | 1 | Transactional Checkout: Stock, Tax & Payment | `tests/server/level-3/task-1/checkout-stock-tax-payment.test.ts` |
| 3 | 2 | Order Lifecycle State Machine | `tests/server/level-3/task-2/order-lifecycle.test.ts` |
| 4 | 1 | Daily & Weekly Sales Reports | `tests/server/level-4/task-1/sales-reports-daily-weekly.test.ts` |
| 4 | 2 | Low-Stock Alert Endpoint | `tests/server/level-4/task-2/low-stock-alerts.test.ts` |
| 5 | 1 | Fix Oversell, Decimal Drift & Timezone | `tests/server/level-5/task-1/concurrency-decimals-timezone.test.ts` |
| 5 | 2 | Write Postmortem Document | `tests/server/level-5/task-2/postmortem-document.test.ts` |

> **Test DB setup:** Copy `.env.example` to `.env`, set `DATABASE_URL_TEST` to a separate Postgres database, then run `npm run test`.