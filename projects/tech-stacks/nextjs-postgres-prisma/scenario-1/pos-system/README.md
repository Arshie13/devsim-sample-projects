This is a [Next.js](https://nextjs.org) project that uses [Prisma](https://www.prisma.io) with a PostgreSQL database.

## Run in Docker (recommended)

Requires only Docker. No local Node, pnpm, or Postgres needed.

```bash
docker compose up
```

This builds the app image, starts Postgres, applies migrations, seeds the database, and starts the dev server on [http://localhost:3000](http://localhost:3000). To run the graders inside the container:

```bash
docker compose exec app pnpm test:task:l1:t1
```

To start fresh (wipe the Postgres volume):

```bash
docker compose down -v
```

## Run on your host

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Configure the database connection. The `.env` file holds a `DATABASE_URL`
   pointing at a local PostgreSQL instance — update the credentials/host/database
   to match your environment:

   ```
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/pos_system?schema=public"
   ```

3. Create the database schema and generate the Prisma client:

   ```bash
   pnpm prisma:migrate
   ```

4. Seed the database with sample products and coupons:

   ```bash
   pnpm prisma:seed
   ```

5. Run the development server:

   ```bash
   pnpm dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Architecture

- **Database access**: [Prisma](https://www.prisma.io). The schema lives in
  [`prisma/schema.prisma`](prisma/schema.prisma) and the shared client in
  [`src/lib/prisma.ts`](src/lib/prisma.ts).
- **API**: Next.js route handlers under [`src/app/api`](src/app/api) expose the
  data to the client components.
