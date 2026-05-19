# WorkPulse Manager Dashboard

A Next.js employee time-tracking dashboard backed by **PostgreSQL** through
**Prisma**.

## Tech stack

- Next.js 15 (App Router)
- PostgreSQL + Prisma ORM

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure the database connection in `.env`:

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/workpulse?schema=public"
   ```

3. Create the database schema and generate the Prisma client:

   ```bash
   npx prisma db push
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000). If the database cannot be
reached, the dashboard falls back to built-in demo data.

## Data model

Prisma models (see `prisma/schema.prisma`):

- `Employee` — staff records
- `TimeEntry` — clock-in / clock-out entries
- `TimeOffRequest` — time-off requests
- `PayrollPeriod` / `PayrollRecord` — payroll data

## API routes

- `GET /api/dashboard` — aggregated employees, time entries, time-off requests,
  payroll periods and records
- `PATCH /api/time-off/[id]` — approve or reject a time-off request
