# City Hall Customer Support

A Next.js + shadcn/ui customer support portal used in the City Hall scenario.

## Structure

```
customer-support-city-hall/
├── package.json     # Next.js application
├── src/             # App code (app router, components, lib)
├── public/
└── tests/           # Test suite (level-1..5/task-1..2)
    ├── README.md
    ├── utils/render-utils.tsx
    └── level-1/ ... level-5/
```

## Quick start

```bash
pnpm install
pnpm dev                  # http://localhost:3000
```

## Running tests

```bash
pnpm run test:run                  # run all tests
pnpm run test:task:l1:t1           # single task
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

See [`tests/README.md`](tests/README.md) for the test suite overview.
