# City Hall Customer Support

Full-stack scaffolding for a Next.js + shadcn/ui customer support portal used in the City Hall scenario.

## Structure

```
customer-support-city-hall/
├── package.json     # Root orchestrator (concurrently runs client + server tests)
├── client/          # Next.js application
│   ├── levels.md    # Challenge spec
│   ├── src/         # App code (app router, components, lib)
│   └── ...
├── server/          # Stub – this scenario is client-only
└── tests/           # Test suite (level-1..5/task-1..2)
    ├── README.md
    ├── QUICKSTART.md
    ├── SUMMARY.md
    ├── TEST_STRUCTURE.md
    ├── utils/render-utils.tsx
    └── client/
```

## Quick start

```bash
pnpm install
cd client && pnpm install && cd ..
pnpm run dev:client       # http://localhost:3000
```

## Running tests

```bash
pnpm run test:run                  # client + server in parallel
cd client && pnpm run test:task:l1:t1   # single task
```

## Routes

- `/` – Citizen vs. agent landing
- `/support` – Citizen AI chat + agent connection
- `/support/history` – (Level 3) Past complaint history
- `/agent/login` – Agent login (admin / admin123)
- `/agent` – Agent dashboard (conversations, messages, customer details)

## Demo credentials

| Role          | Username | Password |
| ------------- | -------- | -------- |
| Support Agent | admin    | admin123 |

See [`client/levels.md`](client/levels.md) for the full challenge spec, and [`tests/README.md`](tests/README.md) for the test suite overview.
