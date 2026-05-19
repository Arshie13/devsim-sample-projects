# NOVO Enterprises POS

A Next.js point-of-sale system backed by **PostgreSQL** through **Prisma**, with
authentication handled by **Auth.js (NextAuth v5)**.

## Tech stack

- Next.js 15 (App Router)
- PostgreSQL + Prisma ORM
- Auth.js (NextAuth) credentials provider with bcrypt password hashing

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure environment variables in `.env`:

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/pos_system?schema=public"
   AUTH_SECRET="<run: npx auth secret>"
   ```

3. Create the database schema and generate the Prisma client:

   ```bash
   npx prisma db push
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) and create an admin account
to sign in.

## Data model

Prisma models (see `prisma/schema.prisma`):

- `User`, `Account`, `Session`, `VerificationToken` — Auth.js tables
- `Product` — inventory items
- `Coupon` — discount codes
- `Order` / `OrderItem` — completed sales

## API routes

- `POST /api/auth/register` — create an admin account
- `/api/auth/[...nextauth]` — Auth.js sign-in / sign-out
- `GET|POST /api/products`, `PUT|DELETE /api/products/[id]`
- `GET|POST /api/coupons`, `PATCH|DELETE /api/coupons/[id]`
- `GET|POST /api/orders`, `GET /api/orders/[id]`
