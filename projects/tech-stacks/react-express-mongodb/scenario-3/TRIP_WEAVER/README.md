# TripWeaver

A collaborative trip-planning platform for WanderMint Studios — MERN Scenario 3 for DevSim.

## Stack

- **Frontend**: React 19 + Vite + Tailwind CSS
- **Backend**: Express + Mongoose
- **Database**: MongoDB

## Setup

### 1. Install dependencies

```bash
# From the project root (TRIP_WEAVER/)
pnpm install

# Client
cd client && pnpm install

# Server
cd ../server && pnpm install
```

### 2. Configure environment

```bash
cd server
cp .env.example .env
# Edit .env and set MONGO_URI to your MongoDB connection string
```

### 3. Seed the database

```bash
# From TRIP_WEAVER/
pnpm run db:seed
```

### 4. Start development servers

```bash
# From TRIP_WEAVER/ — starts both client and server
pnpm run dev
```

- Client: http://localhost:5173
- Server: http://localhost:4000

## Running Tests

```bash
# All tests
pnpm test

# By level
pnpm run test:tasks:l1
pnpm run test:tasks:l2
pnpm run test:tasks:l3
pnpm run test:tasks:l4
pnpm run test:tasks:l5
```

## Project Structure

```
TRIP_WEAVER/
├── client/          React frontend
├── server/          Express backend
└── tests/           Vitest test suites
    ├── client/      React Testing Library tests
    └── server/      Supertest + mongodb-memory-server tests
```
