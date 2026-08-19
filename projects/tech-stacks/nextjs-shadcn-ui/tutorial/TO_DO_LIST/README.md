# To-Do List - Next.js + Shadcn UI Tutorial Sample

## Project Overview

**Goal:** Build a minimal one-page to-do list web app using Next.js and Shadcn UI components.

This sample is intentionally surface-level and includes only essential frontend functionality. All data is managed in React state — no backend or database is required.

## Tech Stack

- Next.js 16 (App Router)
- Shadcn UI + Tailwind CSS v4
- TypeScript

## Features

- View todo items
- Add a todo item
- Toggle completion (checkbox)
- Delete a todo item
- Start with seeded mock todos

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
pnpm dlx shadcn@latest add checkbox
pnpm dlx shadcn@latest add badge
```

3. Start the development server:

```bash
pnpm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Folder Structure

```text
TO_DO_LIST/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   └── ui/          ← created by `npx shadcn add`
│   └── lib/
│       ├── mockData.ts
│       └── utils.ts
├── .gitignore
├── components.json      ← Shadcn UI configuration
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
└── tsconfig.json
```

## Notes

- Mock data is defined in `src/lib/mockData.ts`.
- All state is managed in React — refreshing the page resets the list to mock data.
- Shadcn UI components are added via the CLI (`pnpm dlx shadcn@latest add`) and live in `src/components/ui/`.
- Radix UI primitives are pre-declared in `package.json` so there is no need to run `shadcn init`.
