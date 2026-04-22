# Test Suite Structure

## 📁 Directory Layout

```
library-management/
├── levels.md                          # Challenge levels definition
├── vitest.config.ts                   # Vitest configuration
├── package.json                       # Dependencies (needs test deps added)
├── src/
│   ├── __tests__/
│   │   └── setup.tsx                  # Global test setup & mocks
│   └── ... (app code)
└── tests/                             # Test suite (NEW)
    ├── README.md                      # Test documentation
    ├── QUICKSTART.md                  # Quick start guide
    ├── SUMMARY.md                     # This summary
    ├── utils/
    │   └── render-utils.tsx           # Test utilities & helpers
    ├── level-1/                       # Level 1: Setup & UI (10 pts)
    │   ├── task-1-environment-setup.test.tsx
    │   ├── task-2-ui-text-updates.test.tsx
    │   └── task-3-env-var-usage.test.tsx
    ├── level-2/                       # Level 2: Bug Fixes (25 pts)
    │   ├── task-1-badge-colors.test.tsx
    │   ├── task-2-refactoring.test.tsx
    │   └── task-3-bookrow-component.test.tsx
    ├── level-3/                       # Level 3: Features (40 pts)
    │   ├── task-1-search-filter.test.tsx
    │   ├── task-2-borrow-functionality.test.tsx
    │   └── task-3-returns-page.test.tsx
    ├── level-4/                       # Level 4: Edge Cases (60 pts)
    │   ├── task-1-overdue-validation.test.tsx
    │   ├── task-2-due-date-calculation.test.tsx
    │   ├── task-3-confirmation-dialogs.test.tsx
    │   └── task-4-localstorage-persistence.test.tsx
    └── level-5/                       # Level 5: Master (75 pts)
        ├── task-1-overdue-fix.test.tsx
        ├── task-2-overdue-report.test.tsx
        ├── task-3-date-utils.test.ts
        └── task-4-documentation.test.tsx
```

## 📊 Statistics

- **Total Test Files**: 17
- **Test Cases**: ~80+ individual assertions
- **Coverage Areas**: 11+ feature areas
- **Maximum Score**: 210 points + bonus

## 🔧 Setup Instructions

### 1. Install Dependencies

```bash
cd projects/tech-stacks/nextjs-shadcn-ui/scenario-1/library-management
npm install
```

Required devDependencies (add to package.json):
```json
{
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.3.0",
    "jsdom": "^26.1.0",
    "vitest": "^3.2.4"
  }
}
```

### 2. Run Tests

```bash
# All tests (watch mode)
npm test

# Single run (CI)
npm run test:run

# Specific level
npm run test:run -- tests/level-1/

# Specific file
npm run test:run -- tests/level-3/task-2-borrow-functionality.test.tsx
```

## 🎯 Level Mapping

Each test file corresponds directly to a task in [`levels.md`](../levels.md):

| Level | Test File | Task Description |
|-------|-----------|------------------|
| 1 | `task-1-*.test.tsx` | Environment Setup |
| 1 | `task-2-*.test.tsx` | UI Text Updates |
| 1 | `task-3-*.test.tsx` | Env Var Usage |
| 2 | `task-1-*.test.tsx` | Badge Colors |
| 2 | `task-2-*.test.tsx` | Refactoring |
| 2 | `task-3-*.test.tsx` | BookRow Component |
| 3 | `task-1-*.test.tsx` | Search & Filter |
| 3 | `task-2-*.test.tsx` | Borrow Functionality |
| 3 | `task-3-*.test.tsx` | Returns Page |
| 4 | `task-1-*.test.tsx` | Overdue Validation |
| 4 | `task-2-*.test.tsx` | Due Date Calculation |
| 4 | `task-3-*.test.tsx` | Confirmation Dialogs |
| 4 | `task-4-*.test.tsx` | localStorage Persistence |
| 5 | `task-1-*.test.tsx` | Overdue Fix |
| 5 | `task-2-*.test.tsx` | Overdue Report |
| 5 | `task-3-*.test.tsx` | Date Utils |
| 5 | `task-4-*.test.tsx` | Documentation |

## 🧪 Test Patterns Used

### Rendering Tests
```tsx
render(<Component />)
expect(screen.getByText('Expected')).toBeInTheDocument()
```

### Interaction Tests
```tsx
fireEvent.click(screen.getByRole('button', { name: /submit/i }))
fireEvent.change(screen.getByLabelText(/email/i), {
  target: { value: 'test@example.com' }
})
```

### Async Tests
```tsx
await waitFor(() => {
  expect(screen.getByText('Updated')).toBeInTheDocument()
})
```

### Setup/Teardown
```tsx
beforeEach(() => {
  localStorage.clear()
  // Reset mock data
})
```

## 📝 Key Test Assertions

### Level 1
- ✅ Environment variables are defined
- ✅ App redirects correctly
- ✅ Text content updated (Register, BookWise Public Library)
- ✅ Env vars used in components

### Level 2
- ✅ Badge colors distinct (green/blue/red)
- ✅ useMemo used for filtering
- ✅ BookRow component renders all props

### Level 3
- ✅ Search input filters by title/author
- ✅ "No books found" message appears
- ✅ Borrow modal opens with form
- ✅ Due date auto-set to 14 days
- ✅ Returns page shows borrowed books
- ✅ Return process updates status

### Level 4
- ✅ Overdue books cannot be borrowed
- ✅ Due date calculated automatically
- ✅ Confirmation dialogs appear
- ✅ Data persists in localStorage
- ✅ Logout clears session

### Level 5
- ✅ Overdue status clears on return
- ✅ Overdue report shows all overdue books
- ✅ Days overdue calculated correctly
- ✅ Date utilities format correctly
- ✅ Documentation exists and accurate

## 🛠️ Mock Configuration

### Global Mocks (in `setup.tsx`)
- `next/navigation` → Mock router with vi.fn()
- `localStorage` → In-memory store
- `next/link` → Simple anchor tags

### Test Data
Common mock objects exported from `utils/render-utils.tsx`:
- `mockLibrarian`
- `mockAvailableBook`
- `mockBorrowedBook`
- `mockOverdueBook`

## 🔍 Troubleshooting

**"Cannot find module 'vitest'"**
→ Run `npm install` to install all dependencies

**"Module not found: '@/app/...'"**
→ Ensure `vitest.config.ts` has correct path aliases matching `tsconfig.json`

**Tests fail because components don't exist**
→ That's expected! Implement features to make tests pass

**localStorage errors**
→ Check that `src/__tests__/setup.tsx` is loaded (configured in vitest.config.ts)

## 📈 Running Specific Levels

```bash
# Level 1 only
npm run test:run -- tests/level-1/

# Level 2 & 3
npm run test:run -- tests/level-2/ tests/level-3/

# All except Level 5
npm run test:run -- tests/ --exclude tests/level-5/

# Single test file
npm run test:run -- tests/level-4/task-3-confirmation-dialogs.test.tsx
```

## 🎓 Learning Objectives

By completing these tests alongside the levels, developers will learn:

1. **Environment Configuration** - Next.js env vars, .env.local
2. **Component Testing** - RTL patterns, assertions
3. **State Management** - useState, useEffect testing
4. **User Interactions** - Events, forms, modals
5. **Data Persistence** - localStorage integration
6. **Date Handling** - Calculations, formatting
7. **Edge Cases** - Validation, error states
8. **Documentation** - Writing clear specs

## 🔄 Continuous Integration

Add to `package.json`:
```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage"
  }
}
```

CI configuration (GitHub Actions):
```yaml
- name: Run tests
  run: npm run test:run
```

## 📚 Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Next.js Testing Guide](https://nextjs.org/docs/app/building-your-application/testing)
- [shadcn/ui Component Testing](https://ui.shadcn.com/docs/components)

---

*Test suite created to match the BookWise Library Management challenge levels.*
*Last updated: 2026-04-21*
