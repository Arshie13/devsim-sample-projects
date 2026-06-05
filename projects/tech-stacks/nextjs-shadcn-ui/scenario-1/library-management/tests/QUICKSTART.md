# Quick Start Guide

## Prerequisites

- Node.js 18+ installed
- pnpm or yarn package manager
- Git (optional)

## Setup

1. **Navigate to the project directory**
   ```bash
   cd projects/tech-stacks/nextjs-shadcn-ui/scenario-1/library-management
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Verify test configuration**
   - Check `vitest.config.ts` exists at project root
   - Check `src/__tests__/setup.tsx` exists
   - Verify `package.json` has test scripts

## Running Tests

### Watch Mode (Development)
```bash
pnpm test
```
Tests will run and watch for file changes.

### Single Run (CI)
```bash
pnpm run test:run
```
Runs tests once and exits.

### With UI
```bash
pnpm run test:ui
```
Opens Vitest UI for interactive testing.

### Coverage Report
```bash
pnpm run test:coverage
```
Generates coverage report in `coverage/` directory.

### Specific Test File
```bash
# Run all level-1 tests
pnpm test -- level-1

# Run specific task folder
pnpm test -- level-1/task-1

# Run specific file
pnpm test -- level-1/task-1/environment-setup.test.tsx

# Run with grep pattern
pnpm test -- -t "environment"
```

## Test Structure

```
tests/
├── level-1/          # Environment & UI (10 pts)
│   ├── task-1/
│   │   └── environment-setup.test.tsx
│   └── task-2/
│       └── ui-text-updates.test.tsx
├── level-2/          # Bug Fixes (25 pts)
│   ├── task-1/
│   │   └── badge-colors.test.tsx
│   └── task-2/
│       └── refactoring.test.tsx
... (similar for levels 3-5)
```

Each level contains **exactly 2 tasks**, each in its own subfolder, matching the `levels.md` specification.

## Writing New Tests

1. **Create task subfolder**
   ```bash
   mkdir tests/level-1/task-3
   ```

2. **Create test file inside**
   ```bash
   touch tests/level-1/task-3/new-feature.test.tsx
   ```

3. **Follow naming convention**:
   ```
   level-{n}/task-{m}/{feature-name}.test.tsx
   ```

4. **Use the template**:
   ```typescript
   import { describe, it, expect, beforeEach } from 'vitest'
   import { render, screen } from '@testing-library/react'
   import { Component } from '@/app/path'

   describe('Component Name', () => {
     beforeEach(() => {
       // Reset mocks, localStorage, etc.
     })

     it('should render correctly', () => {
       render(<Component />)
       expect(screen.getByText('Expected')).toBeInTheDocument()
     })
   })
   ```

5. **Run tests** to verify:
   ```bash
   pnpm test -- level-1/task-3/new-feature.test.tsx
   ```

## Common Issues

### "Cannot find module '@testing-library/react'"
```bash
pnpm add -D @testing-library/react @testing-library/jest-dom
```

### "No test files found"
- Ensure `vitest.config.ts` has correct `test.include` pattern
- Check file naming ends with `.test.tsx`
- Verify files are inside `tests/` directory

### "Module not found: '@/app/...'"
- Verify `tsconfig.json` has correct `paths` configuration
- Check that `vitest.config.ts` has `test.environment = 'jsdom'`

### localStorage errors
- Ensure `src/__tests__/setup.tsx` is loaded (check `vitest.config.ts` `setupFiles`)
- Mock localStorage in individual tests if needed:
  ```typescript
  const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    clear: vi.fn()
  }
  Object.defineProperty(window, 'localStorage', { value: localStorageMock })
  ```

## Debugging

1. **Check console output** for test failures
2. **Use `--reporter verbose`** for detailed output:
   ```bash
   pnpm test -- --reporter verbose
   ```
3. **Run single test** with `--testNamePattern`:
   ```bash
   pnpm test -- -t "should render badge"
   ```
4. **Use debugger**:
   ```typescript
   it('should debug', () => {
     debugger // VS Code will break here
     render(<Component />)
   })
   ```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Next.js Testing Guide](https://nextjs.org/docs/app/building-your-application/testing)
- [shadcn/ui Components](https://ui.shadcn.com/)

## Next Steps

1. Review [`levels.md`](../levels.md) for task requirements
2. Check [`README.md`](README.md) for test suite overview
3. See [`SUMMARY.md`](SUMMARY.md) for complete file listing
4. Read [`TEST_STRUCTURE.md`](TEST_STRUCTURE.md) for architecture details
