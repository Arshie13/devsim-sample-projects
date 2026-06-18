# To-Do List - MERN Tutorial Sample

## Project Overview

**Goal:** Build a minimal one-page to-do list web app using the MERN stack.

This sample is intentionally surface-level and includes only essential full-stack functionality.

## Tech Stack

- MongoDB + Mongoose
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
|   |-- src/
|   |   |-- controllers/
|   |   |-- middleware/
|   |   |-- models/
|   |   |-- routes/
|   |   |-- seed/
|   |   |-- types/
|   |   |-- app.ts
|   |   |-- db.ts
|   |   |-- env.ts
|   |   `-- index.ts
|   `-- package.json
`-- README.md
```

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm 10+
- A running MongoDB instance

**Option A — Local MongoDB install:** Install from https://www.mongodb.com/try/download/community and start `mongod`.

**Option B — Docker (recommended):**

```bash
docker run -d -p 27017:27017 --name todo-mongo mongo:7
```

### Setup

1. Install dependencies:

```bash
pnpm install
cd client && pnpm install
cd ../server && pnpm install
```

2. Create environment file:

```bash
cd server
copy .env.example .env
```

3. Seed starter todos (run from inside `server/`):

```bash
pnpm run db:seed
```

4. Start both apps from the project root:

```bash
cd ..
pnpm run dev
```

## MongoDB Notes

- Unlike relational databases, MongoDB has no migration files. Mongoose schemas live only in your Node.js code.
- The seed script (`server/src/seed/seed.ts`) connects to MongoDB, clears existing todos, inserts demo todos, then disconnects.
- You can re-run `pnpm run db:seed` at any time to reset the database to a clean known state.
- The `MONGO_URI` in `.env` defaults to `mongodb://localhost:27017/todo_tutorial`.

## API Endpoints

- `GET /api/todos` - list todos
- `POST /api/todos` - create todo
- `PATCH /api/todos/:id/toggle` - toggle completion
- `DELETE /api/todos/:id` - delete todo
- `GET /health` - health check
