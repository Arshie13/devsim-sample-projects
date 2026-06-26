# Library Management - Next.js + Shadcn UI Scenario

## Project Overview

**Goal:** Build a frontend page for a library book management system. Track borrowed books, label overdue items, and manage librarian login/signup.

## Tech Stack

- Next.js 16 (App Router)
- Shadcn UI + Tailwind CSS v4
- TypeScript
- Vitest + React Testing Library

## Features

- View all books in the library with their status
- See borrowed and overdue books at a glance
- Track who borrowed each book
- Librarian login and signup pages
- Demo credentials: `admin` / `admin123`

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
pnpm dlx shadcn@latest add dialog
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
```

## Folder Structure

```text
library-management/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── login/
│   │   ├── signup/
│   │   └── dashboard/
│   ├── components/
│   │   └── ui/          ← created by `npx shadcn add`
│   └── lib/
│       ├── mockData.ts
│       └── utils.ts
├── tests/
│   ├── level-1/
│   │   ├── task-1/
│   │   └── task-2/
│   ├── level-2/
│   ├── level-3/
│   ├── level-4/
│   └── level-5/
├── components.json      ← Shadcn UI configuration
├── package.json
└── tsconfig.json
```

## Notes

- Mock data is defined in `src/lib/mockData.ts` with sample books, borrow records, and librarian credentials.
- Radix UI primitives are pre-declared in `package.json` so there is no need to run `shadcn init`.
- Shadcn UI components are added via the CLI (`pnpm dlx shadcn@latest add`) and live in `src/components/ui/`.
- The test suite is organized in `tests/` by level and task.
