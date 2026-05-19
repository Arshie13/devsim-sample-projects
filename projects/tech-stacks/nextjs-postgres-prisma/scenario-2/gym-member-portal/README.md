# FitTech Gym Member Portal

A Next.js member portal backed by **PostgreSQL** through **Prisma**, with
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
   DATABASE_URL="postgresql://user:password@localhost:5432/gym_portal?schema=public"
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

Open [http://localhost:3000](http://localhost:3000), create a member account,
and you will be taken to the portal.

## Data model

Prisma models (see `prisma/schema.prisma`):

- `User`, `Account`, `Session`, `VerificationToken` — Auth.js tables
- `Membership` — a member's membership record
- `Class` — bookable gym classes
- `Booking` — a member's class bookings
- `Attendance` — attendance history

## API routes

- `POST /api/auth/register` — create a member account
- `/api/auth/[...nextauth]` — Auth.js sign-in / sign-out
- `GET /api/classes`
- `GET /api/bookings` (all, or `?userId=` for one member), `POST /api/bookings`
- `DELETE /api/bookings/[id]`

Server components (`membership-details`, `attendance-history`) query Prisma
directly; client components fetch the API routes above.
