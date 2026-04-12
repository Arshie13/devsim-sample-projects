# Expense Tracker — Frontend Developer Challenge Levels

Welcome to Expense Tracker! You've been hired as a frontend developer and assigned to build and enhance the Expense Tracker app. Complete these challenges to level up your frontend engineering skills!

---

## 🎮 Level 1: Environment Setup & Basic Expense Addition
**Difficulty: ⭐ Easy**
**Estimated Time: 30 minutes**
**Points: 10**

### Scenario
You just cloned the frontend repository. Set up the environment and implement basic expense addition functionality.

### Tasks

#### Task 1.1: Environment Setup
1. Install dependencies (`npm install`)
2. Configure `.env` from `.env.example`
3. Start MongoDB with Docker (`docker-compose up -d`)
4. Run Prisma migrations (`npx prisma generate` and `npx prisma db push`)
5. Seed the database (`npx prisma db seed`)
6. Start the development server (`npm run dev`)

#### Task 1.2: Implement Basic Expense Addition
Create a form to add new expenses with fields: description, amount, date, and category (dropdown with predefined categories).

- Create API route for adding expenses
- Update the homepage to include the add expense form
- Validate form inputs using Zod

### Success Criteria
- [ ] Server runs without errors on `http://localhost:3000`
- [ ] Database seeded successfully with categories and sample expenses
- [ ] New expenses can be added via the form

---

## 🎮 Level 2: Category Management
**Difficulty: ⭐⭐ Medium**
**Estimated Time: 1 hour**
**Points: 20**

### Scenario
The Expense Tracker team wants users to be able to create and manage their own expense categories.

### Tasks

#### Task 2.1: Add Category CRUD Operations
Implement full CRUD for categories:
- Create new categories
- View all categories
- Edit category names
- Delete categories (with confirmation)

#### Task 2.2: Update Expense Form to Use Dynamic Categories
Modify the add expense form to load categories dynamically from the database instead of using hardcoded options.

### Success Criteria
- [ ] Users can create, edit, and delete categories
- [ ] Expense form uses dynamic categories from database
- [ ] Categories are properly associated with expenses

---

## 🎮 Level 3: Monthly Summary & Aggregation
**Difficulty: ⭐⭐ Medium**
**Estimated Time: 1-2 hours**
**Points: 25**

### Scenario
Users want to see insights into their spending. Add monthly summary showing total expenses per category.

### Tasks

#### Task 3.1: Create Monthly Summary API
Create an API endpoint that aggregates expenses by category for the current month.

#### Task 3.2: Display Monthly Summary and Total Expenses on Homepage
Add a summary section on the homepage showing:
- Total spent this month
- Breakdown by category with amounts and percentages
- Visual representation (progress bars or simple charts)
- Overall total expenses indicator

### Success Criteria
- [ ] Monthly summary API returns correct aggregated data
- [ ] Homepage displays spending summary with visual elements and total expenses indicator

---

## 🎮 Level 4: Expense Filtering & Search
**Difficulty: ⭐⭐⭐ Hard**
**Estimated Time: 1-2 hours**
**Points: 30**

### Scenario
As expense lists grow, users need ways to filter and search through their expenses.

### Tasks

#### Task 4.1: Implement Expense Filtering
Add filtering capabilities:
- Filter by category
- Filter by date range (start date, end date)
- Filter by amount range (min, max)

#### Task 4.2: Add Search Functionality
Implement search by description (case-insensitive partial match).

### Success Criteria
- [ ] Expenses can be filtered by category, date range, and amount range
- [ ] Search by description works correctly
- [ ] Filters work together (AND logic)

---

## 🎮 Level 5: Advanced Features & Optimizations
**Difficulty: ⭐⭐⭐⭐ Expert**
**Estimated Time: 2-3 hours**
**Points: 40**

### Scenario
Add advanced features to make the Expense Tracker more robust and user-friendly.

### Tasks

#### Task 5.1: Add Expense Editing & Deletion
Implement edit and delete functionality for expenses:
- Edit expense details
- Delete expenses with confirmation
- Update summary after modifications

#### Task 5.2: Add Data Export
Implement CSV export of expenses with filtering options.

### Success Criteria
- [ ] Expenses can be edited and deleted
- [ ] CSV export works with applied filters
- [ ] UI updates correctly after expense modifications