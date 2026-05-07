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
- A running MongoDB instance (local install or Docker — `docker run -d -p 27017:27017 --name recipe-mongo mongo:7`)

## Setup

| Step | Command | Where |
|---|---|---|
| 1 | `npm install` | `RECIPE_NEST/` (root) |
| 2 | `npm install` | `RECIPE_NEST/client/` |
| 3 | `npm install` | `RECIPE_NEST/server/` |
| 4 | `cp .env.example .env` then set `MONGO_URI` | `RECIPE_NEST/server/` |
| 5 | `npm run db:seed` | `RECIPE_NEST/server/` |

## Running the App

From `RECIPE_NEST/`:

```bash
npm run dev
```

This starts the Express API on port `4000` and the Vite dev server on port `5173`.

Open http://localhost:5173 in your browser.

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
