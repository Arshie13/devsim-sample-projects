---

## 🎮 levels.md

```md
# BookWise Library System – Developer Challenge Levels

Welcome to BookWise! You’ve joined the team responsible for maintaining our Library Management System. Complete the levels below to demonstrate your full-stack skills.

---

## 🎮 Level 1: Setup & Simple UI Fixes
**Difficulty: ⭐ Easy**
**Estimated Time: 30 minutes**

### Scenario
The library has onboarded a new developer (you!) and needs the system running locally with minor UI tweaks.

### Tasks

#### Task 1.1: Environment Setup
1. Install dependencies for client and server
2. Configure `.env` with database and JWT secret
3. Run Prisma migrations
4. Start both servers

#### Task 1.2: UI Text Updates
1. Change "Sign Up" to "Register" on the auth page  
   - File: `client/src/pages/auth/Register.tsx`
2. Update header subtitle to:
   **"BookWise Public Library"**  
   - File: `client/src/components/layout/Header.tsx`

### Success Criteria
- [ ] App runs without errors
- [ ] Updated text appears correctly

---

## 🎮 Level 2: Bug Fixing & Refactoring
**Difficulty: ⭐⭐ Medium**
**Estimated Time: 1 hour**

### Scenario
Members report they cannot borrow books even when copies are available.

### Tasks

#### Task 2.1: Bug Fix – Borrow Button Disabled Incorrectly
**Bug:** Books with `availableCopies > 0` are sometimes marked unavailable.

- File: `client/src/pages/BookDetails.tsx`
- Fix incorrect availability condition

**Buggy logic example:**
```ts
const isUnavailable = book.availableCopies <= 1;
Correct behavior:

0 copies → cannot borrow

1+ copies → can borrow

Task 2.2: Refactor Availability Logic
Move availability logic into a reusable helper function.

Success Criteria
 Borrow button works correctly

 Cleaner, reusable logic

🎮 Level 3: Feature Development
Difficulty: ⭐⭐⭐ Hard
Estimated Time: 2–3 hours

Scenario
The library wants better visibility into borrowing activity.

Tasks
Task 3.1: Overdue Books View
Create a page showing:

Overdue books

Member name

Days overdue

Files:

client/src/pages/admin/Overdue.tsx

server/src/routes/borrow.ts

Task 3.2: Member Borrow History
Show full borrowing history in the member dashboard.

Success Criteria
 Overdue list is accurate

 Members can see full history

🎮 Level 4: Integration & Edge Cases
Difficulty: ⭐⭐⭐⭐ Expert
Estimated Time: 2–3 hours

Scenario
Returning books occasionally causes negative available copy counts.

Tasks
Task 4.1: Debug Return Logic
Investigate:

Frontend return request

Backend transaction logic

Prisma update queries

Task 4.2: Add Transaction Safety
Ensure borrow/return operations are atomic.

Success Criteria
 No negative stock values

 Safe concurrent requests

🎮 Level 5: Real Client Issue
Difficulty: ⭐⭐⭐⭐⭐ Master
Estimated Time: 3–4 hours

Issue Report
"Some members are marked overdue even after returning books. The reports don’t match reality."

Tasks
Task 5.1: Investigate Overdue Logic
Timezone handling

Returned date comparison

Status updates

Task 5.2: Fix & Document
Resolve discrepancies

Document root cause and fix

Success Criteria
 Overdue status is accurate

 Reports match borrowing records

 Clear documentation provided

🏆 Scoring
Level 1: 10 pts

Level 2: 25 pts

Level 3: 40 pts

Level 4: 60 pts

Level 5: 75 pts

Bonus for clean code, tests, and docs 📚✨