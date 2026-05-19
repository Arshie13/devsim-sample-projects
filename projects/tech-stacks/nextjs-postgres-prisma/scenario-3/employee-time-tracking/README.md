This is a [Next.js](https://nextjs.org) project that uses [Prisma](https://www.prisma.io) with a PostgreSQL database.

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure the database connection. The `.env` file holds a `DATABASE_URL`
   pointing at a local PostgreSQL instance — update the credentials/host/database
   to match your environment:

   ```
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/employee_time_tracking?schema=public"
   ```

3. Create the database schema and generate the Prisma client:

   ```bash
   npm run prisma:migrate
   ```

4. Seed the database with sample employees, time entries and payroll data:

   ```bash
   npm run prisma:seed
   ```

5. Run the development server:

   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Architecture

- **Database access**: [Prisma](https://www.prisma.io). The schema lives in
  [`prisma/schema.prisma`](prisma/schema.prisma) and the shared client in
  [`src/lib/prisma.ts`](src/lib/prisma.ts).
- **API**: Next.js route handlers under [`src/app/api`](src/app/api) feed the
  manager dashboard. If the API is unavailable the dashboard falls back to
  built-in demo data.
