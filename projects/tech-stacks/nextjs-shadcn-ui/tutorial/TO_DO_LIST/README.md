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

## Folder Structure

```text
TO_DO_LIST/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   └── ui/
│   │       ├── badge.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── checkbox.tsx
│   │       └── input.tsx
│   └── lib/
│       ├── mockData.ts
│       └── utils.ts
├── .gitignore
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
└── tsconfig.json
```

## Quick Start

1. Install dependencies:

```bash
pnpm install
```

2. Start the development server:

```bash
pnpm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Notes

- Mock data is defined in `src/lib/mockData.ts`.
- All state is managed in React — refreshing the page resets the list to mock data.
- Shadcn UI components live in `src/components/ui/` and are customizable.
