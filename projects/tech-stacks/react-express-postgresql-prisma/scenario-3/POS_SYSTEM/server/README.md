# POS System - Server

Node.js + Express + TypeScript backend for the POS System.

## Tech Stack

- **Node.js** - Runtime environment
- **Express** - Web framework
- **TypeScript** - Type safety
- **Prisma** - ORM
- **PostgreSQL** - Database
- **Zod** - Schema validation
- **JWT (JSON Web Tokens)** - Authentication
- **Bcrypt** - Password hashing

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL installed and running

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/pos_db?schema=public"
JWT_SECRET="your_super_secret_key"
JWT_EXPIRES_IN="7d"
PORT=5000
```

### Installation

```bash
# From the server directory
npm install

# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Start development server
npm run dev
```

The server will run on `http://localhost:5000` (or the port specified in .env).

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server
- `npm run db:migrate` - Run Prisma migrations
- `npm run db:generate` - Generate Prisma client
- `npm run db:studio` - Open Prisma Studio to view database

## Project Structure

```
server/
├── prisma/             # Prisma schema and migrations
│   └── schema.prisma   # Database schema definition
├── src/
│   ├── lib/            # Shared libraries / clients
│   │   └── prisma.ts   # Prisma client instance
│   ├── middleware/     # Express middleware
│   │   ├── auth.ts     # Authentication middleware
│   │   └── errorHandler.ts # Global error handler
│   ├── routes/         # API Route definitions
│   │   ├── auth.ts     # Authentication routes
│   │   ├── categories.ts # Category management
│   │   ├── inventory.ts # Inventory management
│   │   ├── orders.ts   # Order processing
│   │   ├── products.ts # Product management
│   │   └── settings.ts # System settings
│   ├── index.ts        # Entry point and app configuration
├── .env                # Environment variables
├── package.json
└── tsconfig.json
```

## Features & API Routes

1. **Authentication** (`/api/auth`)
   - Register new users
   - Login (Admin/Cashier)
   - Get current user profile

2. **Products** (`/api/products`)
   - CRUD operations for products
   - Search and filtering

3. **Categories** (`/api/categories`)
   - Manage product categories

4. **Inventory** (`/api/inventory`)
   - Track stock levels
   - Low stock alerts
   - Update inventory counts

5. **Orders** (`/api/orders`)
   - Create new orders (checkout)
   - View order history
   - Sales reporting

6. **Settings** (`/api/settings`)
   - Store configuration
