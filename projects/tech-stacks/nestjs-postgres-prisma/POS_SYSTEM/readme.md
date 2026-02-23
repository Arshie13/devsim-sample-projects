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
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run Prisma migrations
- `npm run prisma:seed` - Seed database with sample data
- `npm run prisma:studio` - Open Prisma Studio to view database

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
