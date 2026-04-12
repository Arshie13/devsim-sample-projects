# StudyPlanner — Frontend Developer Challenge Levels

Welcome to StudyPlanner! You've been hired as a frontend developer and assigned to build and enhance the StudyPlanner app. Complete these challenges to level up your frontend engineering skills!

---

## 🎮 Level 1: Environment Setup & Database Initialization
**Difficulty: ⭐ Easy**
**Estimated Time: 30 minutes**
**Points: 10**

### Scenario
You just cloned the frontend repository. Set up the environment and ensure everything runs correctly.

### Tasks

#### Task 1.1: Environment Setup
1. Install dependencies (`npm install`)
2. Configure `.env` from `.env.example`
3. Start MongoDB with Docker (`docker-compose up -d`)
4. Run Prisma migrations (`npx prisma generate` and `npx prisma db push`)
5. Seed the database (`npx prisma db seed`)
6. Start the development server (`npm run dev`)

#### Task 1.2: Minor Schema Update
Add a new optional field `priority` (String, enum: 'low', 'medium', 'high') to the Task model to allow users to prioritize tasks.

- Update `prisma/schema.prisma`
- Run database push
- Update the seed script to include priorities on a few sample tasks
- Update the frontend to display priority

### Success Criteria
- [ ] Server runs without errors on `http://localhost:3000`
- [ ] Database seeded successfully with subjects and tasks
- [ ] New `priority` field works in task creation and display

---

## 🎮 Level 2: Task Management Enhancements
**Difficulty: ⭐⭐ Medium**
**Estimated Time: 1–2 hours**
**Points: 25**

### Scenario
The StudyPlanner team wants to improve task browsing and management. Add filtering, sorting, and bulk operations.

### Tasks

#### Task 2.1: Add Filtering and Sorting to Tasks
Implement filtering and sorting for tasks:
- Support `?status=` (completed, pending, all)
- Support `?priority=` (low, medium, high, all)
- Support `?sortBy=` (deadline, createdAt, priority)
- Support `?sortOrder=` (asc, desc)
- Default: status=all, sortBy=deadline, sortOrder=asc

#### Task 2.2: Add Bulk Task Operations
Add bulk actions for tasks:
- Bulk mark as completed/incomplete
- Bulk delete tasks
- Select all/none functionality
- Show selected count

### Success Criteria
- [ ] Tasks can be filtered by status and priority
- [ ] Tasks can be sorted by deadline, created date, and priority
- [ ] Bulk operations work correctly

---

## 🎮 Level 3: User Authentication & Multi-User Support
**Difficulty: ⭐⭐⭐ Hard**
**Estimated Time: 2–3 hours**
**Points: 40**

### Scenario
StudyPlanner needs to support multiple users. Implement authentication and user-specific data isolation.

### Tasks

#### Task 3.1: Add User Model and Authentication
- Add User model to Prisma schema (email, password hash, name)
- Implement JWT authentication with NextAuth.js
- Add login/register pages
- Protect API routes with authentication

#### Task 3.2: Implement User Data Isolation
- Add userId to Subject and Task models
- Update all API routes to filter by current user
- Update seed script to create sample users
- Migrate existing data to first user

### Success Criteria
- [ ] Users can register and login securely
- [ ] Data is properly isolated between users

---

## 🎮 Level 4: Notifications & Reminders
**Difficulty: ⭐⭐⭐⭐ Expert**
**Estimated Time: 2–3 hours**
**Points: 60**

### Scenario
Students need reminders for upcoming deadlines. Implement notification system and deadline tracking.

### Tasks

#### Task 4.1: Implement Deadline Notifications
- Add notification preferences to User model
- Create API endpoint for sending deadline reminders
- Implement email notifications for upcoming deadlines (1 day, 3 days, 1 week)
- Add browser notifications for real-time alerts

#### Task 4.2: Add Notification History
- Create Notification model (userId, type, message, read status, createdAt)
- Add notifications page to view past notifications
- Mark notifications as read/unread
- Clean up old notifications (30+ days)

### Success Criteria
- [ ] Deadline notifications are sent correctly
- [ ] Notification history is maintained

---

## 🎮 Level 5: Analytics & Progress Reports
**Difficulty: ⭐⭐⭐⭐⭐ Master**
**Estimated Time: 3–4 hours**
**Points: 80**

### Scenario
Students want insights into their study habits. Implement comprehensive analytics and reporting.

### Tasks

#### Task 5.1: Implement Study Analytics
Create analytics API endpoints:
- `GET /api/analytics/overview` - total tasks, completion rate, average progress
- `GET /api/analytics/subject-breakdown` - progress by subject
- `GET /api/analytics/time-tracking` - study time estimates

#### Task 5.2: Add Progress Trends
- Implement trend analysis over time (weekly/monthly)
- Completion rate trends
- Subject performance tracking
- Productivity patterns

### Success Criteria
- [ ] Analytics provide accurate insights
- [ ] Trends show meaningful patterns
