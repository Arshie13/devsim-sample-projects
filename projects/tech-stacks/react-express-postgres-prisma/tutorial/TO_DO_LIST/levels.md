# To-Do List Tutorial - Developer Levels

This tutorial project is intentionally small. It is designed for quick PERN setup practice.

---

## Level 1: Setup and Run
**Difficulty: Easy**

### Tasks
1. Install dependencies in root, client, and server.
2. Create a `server/.env` file from `server/.env.example`.
3. Run Prisma migration to create the `Todo` table.
4. Seed tutorial data with `npm run db:seed` in `server/`.
5. Start the app and confirm the page loads.

### Success Criteria
- [ ] Frontend runs on port 5173.
- [ ] Backend runs on port 4000.
- [ ] You can add and remove a todo.

---

## Level 2: Small Enhancements
**Difficulty: Medium**

### Tasks
1. Add character limit feedback while typing a todo title.
2. Show count of completed todos.
3. Add endpoint to clear completed todos.

### Success Criteria
- [ ] UI shows completed count.
- [ ] Clear completed action works end to end.
