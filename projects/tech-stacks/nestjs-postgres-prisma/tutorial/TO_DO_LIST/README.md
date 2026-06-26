# To-Do List - NestJS Tutorial Sample

## Project Overview

**Goal:** Build a minimal to-do list REST API using the NestJS + PostgreSQL + Prisma stack.

This sample is intentionally surface-level and includes only essential backend functionality. There is no frontend — all interaction happens through API endpoints.

## Tech Stack

- PostgreSQL + Prisma ORM
- NestJS + TypeScript

## Features

- List all todo items
- Create a todo item
- Toggle todo completion
- Delete a todo item
- Start with seeded demo todos

## Folder Structure

```text
TO_DO_LIST/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── app.module.ts
│   ├── main.ts
│   ├── common/
│   │   └── filters/
│   │       └── http-exception.filter.ts
│   ├── prisma/
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   └── todos/
│       ├── dto/
│       │   └── create-todo.dto.ts
│       ├── todos.controller.ts
│       ├── todos.module.ts
│       └── todos.service.ts
├── .env.example
├── nest-cli.json
├── package.json
├── tsconfig.build.json
└── tsconfig.json
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

3. Run Prisma migration:

```bash
pnpm run prisma:migrate
```

4. Seed starter todos:

```bash
pnpm run db:seed
```

5. Start the server:

```bash
pnpm run dev
```

## API Endpoints

- `GET /api/todos` - list all todos
- `POST /api/todos` - create a todo
- `PATCH /api/todos/:id/toggle` - toggle completion
- `DELETE /api/todos/:id` - delete a todo

## Prisma Notes

- `DATABASE_URL` is read from the `.env` file.
- The schema datasource block declares `url = env("DATABASE_URL")`. Prisma requires `url` in the `datasource` block — the environment variable alone is not enough, and omitting it fails validation with `P1012` ("Argument `url` is missing").
