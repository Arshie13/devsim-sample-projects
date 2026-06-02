# RecipeNest

Social recipe-sharing platform built with the MERN stack — React 19 + Vite + Tailwind on the client, Express + Mongoose on the server, MongoDB for storage.

## Project Structure

```
RECIPE_NEST/
├── client/          React 19 + Vite + Tailwind frontend
├── server/          Express + Mongoose API
└── tests/           Vitest task tests (level-1 ... level-5)
```

## Prerequisites

- Node.js 20+
- npm 10+
- A running MongoDB instance

**Option A — Local MongoDB install:** Install from https://www.mongodb.com/try/download/community and start `mongod`.

**Option B — Docker (recommended for quick start):**
```bash
docker run -d -p 27017:27017 --name recipe-mongo mongo:7
```

## Setup

Run these commands in order:

```bash
# 1. Install root workspace dependencies  (from RECIPE_NEST/)
npm install

# 2. Install client dependencies
cd client
npm install
cd ..

# 3. Install server dependencies
cd server
npm install

# 4. Seed the database — run this from inside server/
npm run db:seed
cd ..
```

> **Note:** A `.env` file is already included in `server/` with default values for local development (`MONGO_URI=mongodb://localhost:27017/recipenest`). You do not need to create or edit it — just make sure MongoDB is running before running the seed.

The `db:seed` script lives in `server/package.json` and must be run from the `server/` directory:
```
server/
  src/
    seed/
      seed.ts   ← this is what npm run db:seed executes
  package.json  ← "db:seed": "tsx src/seed/seed.ts"
```

## Running the App

From `RECIPE_NEST/`:

```bash
npm run dev
```

This starts the Express API on port `4000` and the Vite dev server on port `5173`.

Open http://localhost:5173 in your browser.

## Seeded Accounts

After running `npm run db:seed`, the following accounts are available to sign in with immediately:

| Username | Email | Password |
|---|---|---|
| `chefa` | `alex@recipenest.dev` | `password123` |
| `beat` | `bea@recipenest.dev` | `password123` |
| `carlosm` | `carlos@recipenest.dev` | `password123` |
| `danip` | `dani@recipenest.dev` | `password123` |
| `elio` | `eli@recipenest.dev` | `password123` |
| `fatk` | `fatima@recipenest.dev` | `password123` |
| `gusl` | `gus@recipenest.dev` | `password123` |
| `hanab` | `hana@recipenest.dev` | `password123` |

The seed also creates 12 recipes, 10 comments, and 10 saved-recipe relationships between these accounts so the app has real content to browse immediately.

### How MongoDB seeding works

Unlike relational databases (PostgreSQL, MySQL), MongoDB has no migration files or schema history. There is no `CREATE TABLE` or `ALTER TABLE` — Mongoose schemas exist only in your Node.js code. "Seeding" simply means running a script that connects to MongoDB and inserts documents using your Mongoose models, the same way your API routes insert them.

The seed script at `server/src/seed/seed.ts`:
1. Connects to MongoDB via `MONGO_URI` from `.env`
2. Clears any existing documents from User, Recipe, Comment, Save, and Rating collections
3. Creates 8 users with hashed passwords
4. Creates 12 recipes belonging to those users
5. Creates comments and saves linking users to recipes
6. Disconnects

You can re-run `npm run db:seed` at any time to reset the database to a clean known state.

## Running Tests

```bash
# Run all tests
npm test

# Run only client or server tests
npm run test:client
npm run test:server

# Run tests for a specific level
npm run test:tasks:l3

# Run a specific task's test
npm run test:task:server:l5:t1
```

## Task Test Map

| Level | Task | Test file |
|---|---|---|
| 1.1 | Prepare Development Environment | `tests/client/level-1/task-1/setup-check.test.ts` |
| 1.2 | Update Brand Subtitle | `tests/client/level-1/task-2/header-brand.test.ts` |
| 2.1 | Implement Recipe Card | `tests/client/level-2/task-1/recipe-card.test.tsx` |
| 2.2 | Wire Live Search Filter | `tests/client/level-2/task-2/feed-search.test.tsx` |
| 3.1 | Fix Trending Aggregation | `tests/server/level-3/task-1/trending-aggregation.test.ts` |
| 3.2 | Expose Trending Endpoint | `tests/server/level-3/task-2/trending-endpoint.test.ts` |
| 4.1 | Save Recipe Feature | `tests/server/level-4/task-1/save-recipe-api.test.ts` + `tests/client/level-4/task-1/save-button.test.tsx` |
| 4.2 | Saved Recipes Page | `tests/server/level-4/task-2/saved-recipes-list-api.test.ts` + `tests/client/level-4/task-2/saved-recipes-page.test.tsx` |
| 5.1 | Fix Duplicate Saves & Counter Drift | `tests/server/level-5/task-1/save-uniqueness-and-counter.test.ts` |
| 5.2 | Fix Posted-At Timezone Bug | `tests/server/level-5/task-2/posted-at-timezone.test.ts` |
