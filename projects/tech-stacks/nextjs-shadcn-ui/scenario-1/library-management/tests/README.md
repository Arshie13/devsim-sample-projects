# BookWise Library Management - Test Suite

Comprehensive test suite for the BookWise Library Management System built with Next.js, TypeScript, and shadcn/ui.

## 📋 Overview

This test suite is organized into **5 challenge levels** with **exactly 2 tasks per level**, covering environment setup, UI fixes, feature development, edge cases, and integration testing.

## 🏗️ Directory Structure

```
tests/
├── level-1/                    # 10 points
│   ├── task-1/
│   │   └── environment-setup.test.tsx
│   └── task-2/
│       └── ui-text-updates.test.tsx
├── level-2/                    # 25 points
│   ├── task-1/
│   │   └── badge-colors.test.tsx
│   └── task-2/
│       └── refactoring.test.tsx
├── level-3/                    # 40 points
│   ├── task-1/
│   │   └── search-filter.test.tsx
│   └── task-2/
│       └── returns-page.test.tsx
├── level-4/                    # 60 points
│   ├── task-1/
│   │   └── overdue-validation.test.tsx
│   └── task-2/
│       └── persistence.test.tsx
├── level-5/                    # 75 points
│   ├── task-1/
│   │   └── overdue-fix-report.test.tsx
│   └── task-2/
│       └── utils-docs.test.tsx
├── utils/
│   └── render-utils.tsx
├── README.md
├── QUICKSTART.md
├── SUMMARY.md
└── TEST_STRUCTURE.md
```

Each task has its own subfolder containing the test file(s) for that task.

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Run tests in watch mode
pnpm test

# Run tests once (CI mode)
pnpm run test:run

# Run with UI
pnpm run test:ui

# Generate coverage report
pnpm run test:coverage
```

## 📊 Test Coverage

| Level | Points | Tasks | Files |
|-------|--------|-------|-------|
| Level 1 | 10 | 2 | 2 test files |
| Level 2 | 25 | 2 | 2 test files |
| Level 3 | 40 | 2 | 2 test files |
| Level 4 | 60 | 2 | 2 test files |
| Level 5 | 75 | 2 | 2 test files |
| **Total** | **210** | **10** | **10 test files** |

## 🎯 Level Breakdown

### Level 1: Environment & UI Basics (10 pts)
- **Task 1** (`task-1/`): Environment variable configuration (`NEXT_PUBLIC_*`)
- **Task 2** (`task-2/`): UI text updates and component rendering

### Level 2: Bug Fixing & Refactoring (25 pts)
- **Task 1** (`task-1/`): Fix badge colors (Available/Checked Out/Overdue)
- **Task 2** (`task-2/`): Refactor with `useMemo` and extract `BookRow` component

### Level 3: Feature Development (40 pts)
- **Task 1** (`task-1/`): Implement search and filter functionality
- **Task 2** (`task-2/`): Create returns page with confirmation dialogs

### Level 4: Integration & Edge Cases (60 pts)
- **Task 1** (`task-1/`): Overdue validation and date calculation
- **Task 2** (`task-2/`): localStorage persistence for borrow/return actions

### Level 5: Real Client Issue (75 pts)
- **Task 1** (`task-1/`): Fix overdue status bug and build report
- **Task 2** (`task-2/`): Create date utilities and update documentation

## 🛠️ Technology Stack

- **Test Runner**: [Vitest](https://vitest.dev/)
- **Framework**: [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- **Environment**: jsdom
- **UI Library**: shadcn/ui components
- **Framework**: Next.js App Router

## 📁 Configuration Files

- [`vitest.config.ts`](../../vitest.config.ts) - Test runner configuration
- [`src/__tests__/setup.tsx`](../../src/__tests__/setup.tsx) - Global test setup and mocks

## 🔧 Running Specific Tests

```bash
# Run all tests
pnpm test

# Run specific level
pnpm test -- level-1

# Run specific task folder
pnpm test -- level-1/task-1

# Run specific file
pnpm test -- level-1/task-1/environment-setup.test.tsx

# Run tests matching pattern
pnpm test -- -t "badge"

# Run with coverage for specific level
pnpm run test:coverage -- level-4
```

## 📖 Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - Step-by-step setup guide
- **[SUMMARY.md](SUMMARY.md)** - Complete file listing and statistics
- **[TEST_STRUCTURE.md](TEST_STRUCTURE.md)** - Architecture and organization details

## 🤝 Contributing

When adding new tests:

1. Create task subfolder: `tests/level-{n}/task-{m}/`
2. Place test file inside: `tests/level-{n}/task-{m}/{feature-name}.test.tsx`
3. Follow naming convention: `{feature-name}.test.tsx`
4. Add appropriate mocks in `src/__tests__/setup.tsx` or locally
5. Update documentation if adding new levels or tasks
6. Ensure tests pass before committing

## 📝 Notes

- Each level has exactly **2 tasks** as per specification
- Each task resides in its own subfolder (`task-1/`, `task-2/`, etc.)
- Test files can cover multiple sub-features within a task
- Bonus points available for clean code and comprehensive coverage
- All tests should be isolated and independent

---

**Project**: BookWise Library Management System
**Tech Stack**: Next.js + TypeScript + shadcn/ui
**Total Points**: 210 + bonus
**Test Files**: 10 (2 per level, each in separate task folders)
