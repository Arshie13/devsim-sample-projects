# Test Structure Documentation

## Directory Layout

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

## File Naming Convention

Each task has its own subfolder. Test files inside follow the pattern:
```
level-{n}/task-{m}/{feature-name}.test.tsx
```

Examples:
- `level-1/task-1/environment-setup.test.tsx`
- `level-4/task-2/persistence.test.tsx`

## Test File Structure

Each test file typically contains:

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Component } from '@/app/path'

describe('Feature Name', () => {
  beforeEach(() => {
    // Setup mocks, localStorage, etc.
  })

  describe('Sub-feature 1', () => {
    it('should do something', () => {
      // Test implementation
    })
  })

  describe('Sub-feature 2', () => {
    it('should handle edge case', () => {
      // Test implementation
    })
  })
})
```

## Test Organization by Level

### Level 1: Environment & UI Basics
- **Task 1** (`task-1/`): Environment variable configuration (`NEXT_PUBLIC_*`)
- **Task 2** (`task-2/`): UI text updates and component rendering

### Level 2: Bug Fixing & Refactoring
- **Task 1** (`task-1/`): Visual styling fixes (badge colors)
- **Task 2** (`task-2/`): Performance optimization and component extraction

### Level 3: Feature Development
- **Task 1** (`task-1/`): Search and filter functionality
- **Task 2** (`task-2/`): Returns page implementation

### Level 4: Integration & Edge Cases
- **Task 1** (`task-1/`): Overdue validation and date calculations
- **Task 2** (`task-2/`): Confirmation dialogs and localStorage persistence

### Level 5: Real Client Issue
- **Task 1** (`task-1/`): Overdue status fix and report generation
- **Task 2** (`task-2/`): Utility functions and documentation

## Shared Utilities

### `utils/render-utils.tsx`

Provides custom render wrapper that includes:
- Router context mocking
- Pathname mocking
- Global test setup

Usage:
```typescript
import { renderWithProviders } from '../utils/render-utils'

renderWithProviders(<Component />, { pathname: '/dashboard' })
```

## Mocking Strategy

### Global Mocks (`src/__tests__/setup.tsx`)
- `next/navigation` (useRouter, usePathname)
- `next/link` (Link component)
- `localStorage` (browser storage)

### Test-Specific Mocks
Each test file can override or extend mocks as needed:
```typescript
vi.mock('@/lib/utils', () => ({
  formatDate: vi.fn((date) => date.toISOString())
}))
```

## Running Specific Test Files

```bash
# Run all tests
npm test

# Run specific level
npm test -- level-1

# Run specific task folder
npm test -- level-1/task-1

# Run specific file
npm test -- level-1/task-1/environment-setup.test.tsx

# Run with coverage
npm run test:coverage
```

## Coverage Goals

- **Level 1**: 100% coverage of environment and UI text
- **Level 2**: 100% coverage of badge colors and refactored components
- **Level 3**: 100% coverage of search, filter, and returns page
- **Level 4**: 100% coverage of validation, dates, and persistence
- **Level 5**: 100% coverage of overdue fix, reports, and utilities

## Best Practices

1. **One assertion per test** when possible
2. **Use descriptive test names** that explain what is being tested
3. **Setup and teardown** using `beforeEach`/`afterEach`
4. **Mock external dependencies** consistently
5. **Test user behavior** not implementation details
6. **Keep tests isolated** from each other
7. **Place tests in task-specific folders** for better organization
