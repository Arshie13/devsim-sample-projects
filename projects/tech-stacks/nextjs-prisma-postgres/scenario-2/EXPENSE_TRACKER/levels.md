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
3. Start PostgreSQL with Docker (`docker-compose up -d`)
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

#### Task 2.1: Add Category Color and Icon Customization
Add visual customization options for categories:
- Add color picker for each category
- Add icon selection from predefined icon set
- Display color and icon on expense list and summary
- Persist preferences in localStorage

#### Task 2.2: Implement Category Management UI
Build a category management interface:
- Display all categories in a grid/list view
- Add inline editing for category names
- Add delete button with confirmation modal
- Show expense count per category

### Success Criteria
- [ ] Categories display custom colors and icons
- [ ] Color picker and icon selector work correctly
- [ ] Category management UI allows editing and deleting

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
Add a summary section on the homepage showing (using mock data):
- Total spent this month
- Breakdown by category with amounts and percentages
- Visual representation (progress bars or simple charts)
- Overall total expenses indicator

### Success Criteria
- [ ] Monthly summary displays using mock data
- [ ] Visual elements (progress bars, charts) render correctly
- [ ] Total expenses indicator shows accurate totals

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

## 🎮 Level 5: Advanced UX Features
**Difficulty: ⭐⭐⭐⭐ Expert**
**Estimated Time: 2-3 hours**
**Points: 40**

### Scenario
Add advanced UX features to make the Expense Tracker more powerful and user-friendly.

### Tasks

#### Task 5.1: Add Keyboard Shortcuts
Implement keyboard navigation:
- Press 'E' to edit selected expense
- Press 'D' to delete selected expense
- Press 'N' to add new expense
- Press '/' to focus search
- Press '?' to show keyboard help

#### Task 5.2: Add Undo Functionality
Implement undo for actions:
- Undo last delete action
- Undo last edit action
- Show undo toast notification
- Keep history in memory

### Success Criteria
- [ ] All keyboard shortcuts work
- [ ] Undo restores previous state
- [ ] Help modal shows shortcuts