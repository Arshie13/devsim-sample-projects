# BookWise Library System – Developer Challenge Levels

Welcome to BookWise! You've joined the team responsible for maintaining our Library Management System built with Next.js and shadcn/ui. Complete the levels below to demonstrate your frontend development skills.

---

## 🎮 Level 1: Setup & Simple UI Fixes
**Difficulty: ⭐ Easy**
**Estimated Time: 30 minutes**

### Scenario
The library has onboarded a new developer (you!) and needs the system running locally with minor UI tweaks and environment configuration.

### Tasks

#### Task 1.1: Environment Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment variables by creating a `.env.local` file:
   ```
   NEXT_PUBLIC_APP_NAME=SM Tech Library
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open http://localhost:3000 and verify the app loads
5. Update [`src/app/layout.tsx`](src/app/layout.tsx:1) to use `NEXT_PUBLIC_APP_NAME` for the page title
6. Update the dashboard header to display the app name from env variables

#### Task 1.2: Fix the Library Name Mismatches
1. Change "Sign Up" to "Register" on the auth pages
   - File: [`src/app/login/page.tsx`](src/app/login/page.tsx:1)
   - File: [`src/app/signup/page.tsx`](src/app/signup/page.tsx:1)

2. **Bug:** Several pages display a leftover placeholder name **"BookWise Library"**
   instead of the real library name **"SM Tech Library"**. Correct the header/title
   text on every page so it reads **"SM Tech Library"**:
   - [`src/app/dashboard/page.tsx`](src/app/dashboard/page.tsx:66)
   - [`src/app/login/page.tsx`](src/app/login/page.tsx:55)
   - [`src/app/signup/page.tsx`](src/app/signup/page.tsx:78)
   - [`src/app/returns/page.tsx`](src/app/returns/page.tsx:80)

3. The browser tab title in [`src/app/layout.tsx`](src/app/layout.tsx:16) also still
   shows the placeholder. Update it so the page title reads **"SM Tech Library"**
   (sourcing it from `NEXT_PUBLIC_APP_NAME` satisfies this).

### Success Criteria
- [ ] App runs without errors on `npm run dev`
- [ ] `.env.local` file is properly configured
- [ ] "Register" replaces "Sign Up" on the auth pages
- [ ] Every page header reads "SM Tech Library" — no "BookWise Library" left
- [ ] Page title reflects the environment variable

---

## 🎮 Level 2: Bug Fixing & Refactoring
**Difficulty: ⭐⭐ Medium**
**Estimated Time: 1 hour**

### Scenario
Users report that the book status display is inconsistent and the code needs cleanup.

### Tasks

#### Task 2.1: Fix Status Badge Colors
**Bug:** The badge color for "borrowed" books shows the same color as "available" books.

- File: [`src/app/dashboard/page.tsx`](src/app/dashboard/page.tsx:1)
- Fix: Ensure each status has a distinct color:
  - `available` → green
  - `borrowed` → blue
  - `overdue` → red

#### Task 2.2: Refactor & Extract Component
1. Refactor book filtering to use a single `useMemo` hook that returns an object with `availableBooks`, `borrowedBooks`, and `overdueBooks`
2. Create a reusable [`BookRow`](src/components/BookRow.tsx:1) component:
   - Move table row JSX from dashboard into this component
   - Accept `book` as a prop
   - Update dashboard to use the new component

### Success Criteria
- [ ] Status badges have distinct colors
- [ ] `useMemo` is used for book filtering
- [ ] `BookRow` component exists and works correctly

---

## 🎮 Level 3: Feature Development
**Difficulty: ⭐⭐⭐ Hard**
**Estimated Time: 2–3 hours**

### Scenario
The library wants to expand functionality with new features for better book management.

### Tasks

#### Task 3.1: Search & Borrow Features
1. Add a search input above the books table that filters books by title or author (case-insensitive)
2. Show "No books found" when search yields no results

3. Add a "Borrow" button to each available book row that opens a modal with:
   - Borrower name input
   - Borrower email input
   - Due date (auto-calculated to 14 days from today)

4. On confirm, update book status to `borrowed` and set borrower details

#### Task 3.2: Returns Page
1. Create [`src/app/returns/page.tsx`](src/app/returns/page.tsx:1)
2. Display all currently borrowed books in a table with a "Return" button
3. On return, update book status to `available` and clear borrower info
4. Update the corresponding borrow record status to `returned`
5. Add a link to the returns page in the dashboard navigation

### Success Criteria
- [ ] Search filters books in real-time
- [ ] Borrow modal works and updates the UI
- [ ] Returns page processes returns correctly

---

## 🎮 Level 4: Integration & Edge Cases
**Difficulty: ⭐⭐⭐⭐ Expert**
**Estimated Time: 2–3 hours**

### Scenario
Edge cases and data integrity issues arise when multiple operations happen.

### Tasks

#### Task 4.1: Validation & Date Calculation
1. Prevent borrowing of overdue books (disable/hide borrow button, show message)
2. Auto-calculate due date to 14 days from current date (no manual input)
3. Format due date as `YYYY-MM-DD`

#### Task 4.2: Confirmation & Persistence
1. Add confirmation dialogs before borrowing and returning books using shadcn/ui Dialog
2. Persist all data (books, borrowRecords, librarian) to `localStorage`
3. Create a custom `useLocalStorage` hook in [`src/hooks/useLocalStorage.ts`](src/hooks/useLocalStorage.ts:1)

### Success Criteria
- [ ] Overdue books cannot be borrowed
- [ ] Due date auto-calculates correctly
- [ ] Confirmation dialogs appear before actions
- [ ] Data persists across page refreshes

---

## 🎮 Level 5: Real Client Issue
**Difficulty: ⭐⭐⭐⭐⭐ Master**
**Estimated Time: 3–4 hours**

### Issue Report
"Some books show as overdue even after they've been returned. The dashboard doesn't reflect the actual state. We need better reporting."

### Tasks

#### Task 5.1: Fix Overdue Bug & Build Report
1. Investigate and fix the overdue status bug (ensure both book and borrowRecord statuses update on return)
2. Create [`src/app/overdue/page.tsx`](src/app/overdue/page.tsx:1) showing:
   - Book title, author, borrower name, email
   - Days overdue (calculated from dueDate)
   - "Mark as Returned" button to process returns directly

#### Task 5.2: Utilities & Documentation
1. Create [`src/lib/dateUtils.ts`](src/lib/dateUtils.ts:1) with:
   - `formatDate(dateString): string` → "Jan 15, 2026"
   - `isOverdue(dueDate): boolean` → true/false
2. Update [`README.md`](README.md:1) with:
   - New features added
   - How to test overdue functionality
   - Known limitations
3. Add code comments explaining the overdue logic fix

### Success Criteria
- [ ] Overdue status clears correctly when books are returned
- [ ] Overdue report page displays accurate information
- [ ] Date utilities work correctly
- [ ] Documentation is clear and helpful

---

## 🏆 Scoring

| Level | Points |
|-------|--------|
| Level 1 | 10 pts |
| Level 2 | 25 pts |
| Level 3 | 40 pts |
| Level 4 | 60 pts |
| Level 5 | 75 pts |

**Bonus:** +20 pts for clean code, component organization, and comprehensive tests

---

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [React Hooks Reference](https://react.dev/reference/react)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

*Good luck, developer! The BookWise team is counting on you. 📚✨*
