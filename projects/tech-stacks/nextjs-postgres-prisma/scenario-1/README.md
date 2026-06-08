# POS System

You are a newly hired full-stack developer at NOVO Enterprises Inc. One of the tasks assigned to you is to build a POS system for tracking inventory, managing sales, and managing coupons and discounts, etc. For this level, set up your dependencies in this environment by following the step-by-step on-screen guide.

## 🚀 Tech Stack

- **Next.js** - React framework with App Router
- **Prisma** - ORM for PostgreSQL
- **PostgreSQL** - Database
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling

## 📋 Prerequisites

- Node.js 18+
- pnpm
- PostgreSQL database (or Docker for containerized setup)

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Generate Prisma Client

```bash
pnpm prisma:generate
```

### 3. Run Database Migrations

```bash
pnpm prisma:migrate
```

This will create all necessary tables in your database.

### 4. Seed Database (Optional)

```bash
pnpm prisma:seed
```

This will populate the database with sample products and coupons.

### 5. Start Development Server

```bash
pnpm dev
```

The application will start on `http://localhost:3000`

## 🐳 Docker Setup (Recommended)

Requires only Docker. No local Node, pnpm, or Postgres needed.

```bash
docker compose up
```

This builds the app image, starts Postgres, applies migrations, seeds the database, and starts the dev server on [http://localhost:3000](http://localhost:3000).

To run the graders inside the container:

```bash
docker compose exec app pnpm test:task:l1:t1
```

To start fresh (wipe the Postgres volume):

```bash
docker compose down -v
```

## 📚 API Endpoints

### Products

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID

### Coupons

- `GET /api/coupons` - Get all coupons
- `GET /api/coupons/:id` - Get coupon by ID

### Orders

- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create new order

## 🗄️ Database Schema

### Product

- product_id (UUID) - Primary key
- product_name (String)
- price (Float)
- quantity (Int)
- created_at (DateTime)

### Coupon

- coupon_id (UUID) - Primary key
- code (String) - Unique
- discount_percent (Float)
- is_active (Boolean)
- created_at (DateTime)

### Order

- order_id (UUID) - Primary key
- order_date (DateTime)
- customer_name (String)
- total_amount (Float)
- discount_amount (Float)
- coupon_id (FK, nullable)

### OrderItem

- id (UUID) - Primary key
- order_id (FK)
- product_id (FK)
- quantity (Int)
- unit_price (Float)
- subtotal (Float)

## 🔧 Available Commands

```bash
# Development
pnpm dev              # Start dev server

# Build
pnpm build           # Build for production
pnpm start           # Run production server

# Prisma
pnpm prisma:generate # Generate Prisma Client
pnpm prisma:migrate  # Run migrations
pnpm prisma:seed     # Seed database
pnpm prisma:studio   # Open Prisma Studio (DB GUI)

# Testing
pnpm test             # Run all tests
pnpm test:task:l1:t1  # Run specific task test
```

## 📁 Project Structure

```
pos-system/
├── src/
│   ├── app/
│   │   ├── api/           # API route handlers
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── lib/
│       └── prisma.ts      # Prisma client instance
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Database seed script
├── tests/
│   └── level-1/
│       └── task-1/        # Test files
└── package.json
```

## 📄 License

ISC