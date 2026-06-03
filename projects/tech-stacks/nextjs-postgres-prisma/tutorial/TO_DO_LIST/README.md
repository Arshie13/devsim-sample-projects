# To-Do List - Next.js + PostgreSQL + Prisma Tutorial Sample

## Project Overview

**Goal:** Build a minimal full-stack to-do list web app using the Next.js + PostgreSQL + Prisma stack.

This sample is intentionally surface-level and includes only essential full-stack functionality for Level 1 tasks.

## Tech Stack

- PostgreSQL + Prisma ORM
- Next.js 15 (App Router)
- React + TypeScript
- Tailwind CSS v4
- Vitest + Testing Library

## Features

- View todo items
- Add a todo item
- Toggle completion
- Delete a todo item
- Start with seeded demo todos

## Folder Structure

```text
TO_DO_LIST/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── scripts/
│   └── db-check.ts
├── src/
│   ├── app/
│   │   ├── actions/
│   │   │   └── todos.ts
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── todos/
│   │       └── page.tsx
│   ├── components/
│   │   └── TodoApp.tsx
│   └── lib/
│       └── prisma.ts
├── tests/
│   ├── setup.ts
│   └── level-1/
│       ├── task-1/
│       │   └── setup-check.test.tsx
│       └── task-2/
│           └── format.test.tsx
├── .env.example
├── .gitignore
├── eslint.config.mjs
├── levels.md
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tsconfig.json
└── vitest.config.ts
```

## Quick Start

1. Install dependencies:

```bash
pnpm install
```

2. Create environment file:

```bash
cp .env.example .env
```

3. Apply the database migration:

```bash
pnpm prisma:migrate deploy
```

4. Seed starter todos:

```bash
pnpm prisma:seed
```

5. Start the app:

```bash
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Running Tests

```bash
# Run all Level 1 tests
pnpm test:tasks:l1

# Run individual tasks
pnpm test:task:l1:t1
pnpm test:task:l1:t2
```

## Prisma Notes

- `DATABASE_URL` is read from the `.env` file.
- The schema datasource block uses `env("DATABASE_URL")` for the connection string.
- Run `pnpm prisma:studio` to explore the database visually.
