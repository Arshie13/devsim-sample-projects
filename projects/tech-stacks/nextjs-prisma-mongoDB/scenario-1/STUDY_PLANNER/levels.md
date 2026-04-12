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

#### Task 2.3: Fix Subject Color Validation
Subject colors must be valid hex codes. Add validation:
- Colors must start with # and be 6 characters long
- Only valid hex characters (0-9, a-f, A-F)
- Default to blue if invalid

### Success Criteria
- [ ] Tasks can be filtered by status and priority
- [ ] Tasks can be sorted by deadline, created date, and priority
- [ ] Bulk operations work correctly
- [ ] Invalid subject colors are rejected

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

#### Task 3.3: Add User Profile Management
- Add profile page to view/edit user info
- Add logout functionality
- Add user avatar/color customization

#### Task 3.4: Validate Input Fields
- Email must be valid format
- Password must be at least 8 characters
- Subject/Task names cannot be empty
- Deadlines cannot be in the past

### Success Criteria
- [ ] Users can register and login securely
- [ ] Data is properly isolated between users
- [ ] Profile management works
- [ ] Invalid inputs are rejected with clear errors

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

#### Task 4.3: Implement Smart Reminders
- Add smart suggestions for task scheduling
- Warn when adding tasks with overlapping deadlines
- Suggest optimal study times based on task priorities
- Add deadline conflict detection

#### Task 4.4: Add Notification Settings
- Allow users to customize notification preferences
- Email frequency settings (daily, weekly, off)
- Browser notification permissions
- Custom reminder times

### Success Criteria
- [ ] Deadline notifications are sent correctly
- [ ] Notification history is maintained
- [ ] Smart reminders provide helpful suggestions
- [ ] Users can customize notification settings

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

#### Task 5.3: Create Dashboard Widgets
Add dashboard components:
- Progress charts (bar, pie, line)
- Upcoming deadlines calendar
- Study streak counter
- Achievement badges

#### Task 5.4: Export & Backup Features
- Export data to JSON/CSV
- Generate study reports
- Backup user data
- Import from other formats

### Success Criteria
- [ ] Analytics provide accurate insights
- [ ] Trends show meaningful patterns
- [ ] Dashboard is informative and engaging
- [ ] Export/import features work correctly

---

## 🎮 Level 6: Calendar Integration & Scheduling
**Difficulty: ⭐⭐⭐⭐⭐ Master**
**Estimated Time: 3–4 hours**
**Points: 100**

### Scenario
Students need calendar integration for better scheduling. Implement full calendar features and smart scheduling.

### Tasks

#### Task 6.1: Add Calendar View
- Implement calendar component showing tasks by date
- Support month/week/day views
- Color-code tasks by subject
- Drag-and-drop task scheduling

#### Task 6.2: Google Calendar Integration
- Connect with Google Calendar API
- Sync tasks to Google Calendar
- Import events from Google Calendar
- Handle conflicts and duplicates

#### Task 6.3: Smart Scheduling Algorithm
- Implement intelligent task scheduling
- Consider task priorities and deadlines
- Suggest optimal study sessions
- Avoid scheduling conflicts

#### Task 6.4: Advanced Calendar Features
- Recurring tasks support
- Time blocking for focused study
- Study session planning
- Calendar sharing (read-only)

### Success Criteria
- [ ] Calendar view displays tasks correctly
- [ ] Google Calendar sync works bidirectionally
- [ ] Smart scheduling provides useful recommendations
- [ ] Advanced features enhance productivity