# FitTrackr

Social fitness-tracking platform for the DevSim MERN scenario.

## Stack

- **Client** — React 19, Vite, Tailwind CSS, React Router v6
- **Server** — Express 4, Mongoose 8, JWT auth, Zod validation
- **Database** — MongoDB (local or Atlas)

## Setup

```bash
# 1. Install all dependencies
pnpm install            # root
cd client && pnpm install
cd ../server && pnpm install

# 2. Configure environment
cp server/.env.example server/.env
# Edit server/.env — set MONGO_URI and JWT_SECRET

# 3. Seed the database
pnpm run db:seed

# 4. Start both dev servers
pnpm run dev
```

Client → http://localhost:5173  
API → http://localhost:4000

## Seeded accounts

All seeded users have password `password123`.

| Username     | Role   |
|-------------|--------|
| coachjules  | coach  |
| coachmaya   | coach  |
| tomh        | member |
| priya       | member |
| marcusb     | member |
| linnea      | member |
| dev0        | member |
| kit         | member |

## Running tests

```bash
# Run all tests
pnpm test

# Run per-level task tests
pnpm run test:tasks:l1
pnpm run test:tasks:l2
pnpm run test:tasks:l3
pnpm run test:tasks:l4
pnpm run test:tasks:l5
```
