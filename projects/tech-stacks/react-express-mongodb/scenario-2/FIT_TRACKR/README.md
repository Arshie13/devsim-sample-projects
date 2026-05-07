# FitTrackr

Social fitness-tracking platform for the DevSim MERN scenario.

## Stack

- **Client** — React 19, Vite, Tailwind CSS, React Router v6
- **Server** — Express 4, Mongoose 8, JWT auth, Zod validation
- **Database** — MongoDB (local or Atlas)

## Setup

```bash
# 1. Install all dependencies
npm install            # root
cd client && npm install
cd ../server && npm install

# 2. Configure environment
cp server/.env.example server/.env
# Edit server/.env — set MONGO_URI and JWT_SECRET

# 3. Seed the database
npm run db:seed

# 4. Start both dev servers
npm run dev
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
npm test

# Run per-level task tests
npm run test:tasks:l1
npm run test:tasks:l2
npm run test:tasks:l3
npm run test:tasks:l4
npm run test:tasks:l5
```
