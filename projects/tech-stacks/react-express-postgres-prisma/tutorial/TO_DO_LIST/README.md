# To-Do List - PERN Tutorial Sample

## Project Overview

**Goal:** Build a minimal one-page to-do list web app using the PERN stack.

This sample is intentionally surface-level and includes only essential full-stack functionality.

## Tech Stack

- PostgreSQL + Prisma ORM
- Node.js + Express + TypeScript
- React + Vite + TypeScript

## Features

- View todo items
- Add a todo item
- Toggle completion
- Delete a todo item
- Start with seeded demo todos

## Folder Structure

```text
TO_DO_LIST/
|-- client/
|   |-- src/
|   |   |-- components/
|   |   |-- lib/
|   |   |-- pages/
|   |   |-- services/
|   |   |-- types/
|   |   `-- utils/
|   `-- package.json
|-- server/
|   |-- prisma/
|   |   |-- schema.prisma
|   |   `-- seed.ts
|   |-- prisma.config.ts
|   |-- src/
|   |   |-- controllers/
|   |   |-- middleware/
|   |   |-- routes/
|   |   |-- types/
|   |   |-- utils/
|   |   `-- index.ts
|   `-- package.json
|-- levels.md
`-- README.md
```

## Quick Start

1. Install dependencies:

```bash
npm install
cd client && npm install
cd ../server && npm install
```

2. Create environment file:

```bash
cd server
copy .env.example .env
```

3. Run Prisma migration:

```bash
npm run prisma:migrate
```

4. Seed starter todos:

```bash
npm run prisma:seed
```

5. Start both apps from project root:

```bash
cd ..
cd TO_DO_LIST
npm run dev
```

## Prisma Notes

- `DATABASE_URL` for Prisma migrate is configured in `server/prisma.config.ts`.
- The schema datasource block intentionally omits `url`, matching the Prisma 7 setup.

## API Endpoints

- `GET /api/todos` - list todos
- `POST /api/todos` - create todo
- `PATCH /api/todos/:id/toggle` - toggle completion
- `DELETE /api/todos/:id` - delete todo
