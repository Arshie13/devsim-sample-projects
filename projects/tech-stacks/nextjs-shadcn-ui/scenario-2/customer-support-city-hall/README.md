# Customer Support City Hall - Next.js + Shadcn UI Scenario

## Project Overview

**Goal:** Build a customer support chat system for the local City Hall with an AI helper chat, human agent redirection, and an agent dashboard for managing support conversations.

## Tech Stack

- Next.js 16 (App Router)
- Shadcn UI + Tailwind CSS v4
- TypeScript
- Vitest + React Testing Library

## Features

- Citizen AI chat support with agent redirection
- Support history page
- Agent login and dashboard for managing conversations
- Customer detail view per support request
- Demo credentials: `admin` / `admin123`

## Quick Start

1. Install dependencies:

```bash
pnpm install
```

2. Initialize Shadcn UI and add the required components:

```bash
pnpm dlx shadcn@latest init -y
pnpm dlx shadcn@latest add button
pnpm dlx shadcn@latest add card
pnpm dlx shadcn@latest add input
pnpm dlx shadcn@latest add badge
pnpm dlx shadcn@latest add separator
pnpm dlx shadcn@latest add avatar
```

3. Start the development server:

```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Routes

- `/` – Citizen vs. agent landing page
- `/support` – Citizen AI chat + agent redirection
- `/support/history` – Past complaint history
- `/agent/login` – Agent login (`admin` / `admin123`)
- `/agent` – Agent dashboard (conversations, messages, customer details)

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
customer-support-city-hall/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── support/
│   │   │   └── history/
│   │   └── agent/
│   │       └── login/
│   ├── components/
│   │   └── ui/          ← created by `npx shadcn add`
│   └── lib/
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

- Shadcn UI components are added via the CLI (`pnpm dlx shadcn@latest add`) and live in `src/components/ui/`.
- The test suite is organized in `tests/` by level and task — see [`tests/README.md`](tests/README.md) for details.
