# POS System - Backend Developer Challenge Levels

Welcome to IPPO Software Solutions! You've been hired as a backend developer and assigned to maintain our POS System API. Complete these challenges to level up your backend engineering skills!

---

## 🎮 Level 1: Environment Setup & Database Initialization
**Difficulty: ⭐ Easy**
**Estimated Time: 30 minutes**

### Scenario
You just cloned the backend repository. Set up the environment and ensure everything runs correctly.

### Tasks

#### Task 1.1: Environment Setup
1. Install dependencies
2. Configure `.env`
3. Run Prisma migrations
4. Run seed script
5. Start server

#### Task 1.2: Minor Update
Add a new field `phoneNumber` to the Store Settings model.

### Success Criteria
- [ ] Server runs without errors
- [ ] Database migrated
- [ ] Seed data inserted
- [ ] New field works properly

---

## 🎮 Level 2: Product & Inventory Improvements
**Difficulty: ⭐⭐ Medium**
**Estimated Time: 1–2 hours**

### Tasks

#### Task 2.1: Fix Low Stock Logic
Low stock endpoint currently returns incorrect results when threshold equals quantity.

Fix the comparison logic.

#### Task 2.2: Add Pagination to Products
Implement:
- `?page=`
- `?limit=`

#### Task 2.3: Prevent Negative Inventory
Add validation to block stock updates below zero.

---

## 🎮 Level 3: Checkout & Order Logic
**Difficulty: ⭐⭐⭐ Hard**
**Estimated Time: 2–3 hours**

### Tasks

#### Task 3.1: Implement Tax & Discount Calculation
- Apply tax from Settings
- Support percentage discount

#### Task 3.2: Deduct Inventory Transactionally
Use Prisma transaction to:
- Create order
- Deduct stock
- Rollback if failure

#### Task 3.3: Validate Payment Method
Reject unsupported payment methods.

---

## 🎮 Level 4: Reporting System
**Difficulty: ⭐⭐⭐⭐ Expert**
**Estimated Time: 3 hours**

### Tasks

#### Task 4.1: Implement Daily Sales Report
Return:
- Total sales
- Order count
- Top 5 products

#### Task 4.2: Implement Weekly Report
Aggregate last 7 days.

---

## 🎮 Level 5: Production Bug Investigation
**Difficulty: ⭐⭐⭐⭐⭐ Master**
**Estimated Time: 3–4 hours**

### Reported Issues

1. Sales totals sometimes incorrect
2. Concurrent checkouts cause negative inventory
3. Reports show incorrect order counts near midnight

### Tasks

- Fix decimal precision issues
- Implement optimistic locking
- Fix timezone inconsistencies
- Write explanation document of root causes

---

## 📝 Submission Guidelines

1. Create branch `level-X-solution`
2. Write clean commit messages
3. Document decisions
4. Open Pull Request

---

## 🏆 Scoring

- Level 1: 10 points
- Level 2: 25 points
- Level 3: 40 points
- Level 4: 60 points
- Level 5: 75 points

Good luck, backend engineer! 🚀
