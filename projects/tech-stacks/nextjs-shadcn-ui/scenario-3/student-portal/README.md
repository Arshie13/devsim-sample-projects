# Student Portal - Next.js + Shadcn UI Scenario

## Project Overview

**Goal:** Build a student portal where students can view their grades, class schedule, tuition fees, and current academic standing.

## Tech Stack

- Next.js 16 (App Router)
- Shadcn UI + Tailwind CSS v4
- TypeScript
- Vitest + React Testing Library

## Features

- View grades per semester with course details
- View weekly class schedule with time, room, and professor info
- View tuition fees and payment status
- View current academic standing (GPA, credits, status)
- Student login page
- Demo credentials: Student ID `12-346-78`, password `sample`

## Quick Start

1. Install dependencies:

```bash
pnpm install
```

2. Add the required Shadcn UI components using the CLI. Since `@radix-ui/*` packages are already declared in `package.json`, the CLI will skip installing them and only scaffold the component files:

```bash
pnpm dlx shadcn@latest add button
pnpm dlx shadcn@latest add card
pnpm dlx shadcn@latest add input
pnpm dlx shadcn@latest add label
pnpm dlx shadcn@latest add badge
pnpm dlx shadcn@latest add table
pnpm dlx shadcn@latest add tabs
```

3. Start the development server:

```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Commands

```bash
# Development
pnpm dev                   # Start the dev server
pnpm build                 # Build for production

# Testing
pnpm run test:run                  # Run all tests
pnpm run test:task:l1:t1            # Run specific task test
pnpm run test:tasks                 # Run all task tests sequentially
```

## Folder Structure

```text
student-portal/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── login/
│   │   └── dashboard/
│   │       ├── layout.tsx
│   │       ├── page.tsx
│   │       ├── grades/
│   │       ├── schedule/
│   │       ├── fees/
│   │       └── standing/
│   ├── components/
│   │   └── ui/          ← created by `pnpm dlx shadcn add`
│   └── lib/
│       ├── mockData.ts
│       └── utils.ts
├── tests/
│   ├── level-1/
│   ├── level-2/
│   ├── level-3/
│   ├── level-4/
│   └── level-5/
├── components.json      ← Shadcn UI configuration
├── package.json
└── tsconfig.json
```

## Notes

- Mock data is defined in `src/lib/mockData.ts` with sample student info, grades, schedule, and fees.
- Radix UI primitives are pre-declared in `package.json` so there is no need to run `shadcn init`.
- Shadcn UI components are added via the CLI (`pnpm dlx shadcn@latest add`) and live in `src/components/ui/`.
- The test suite is organized in `tests/` by level and task.
