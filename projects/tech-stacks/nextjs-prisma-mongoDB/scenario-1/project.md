# Study Planner - Scenario 1

## Project Overview

A Study Planner application built with Next.js 15, Prisma, and MongoDB that allows students to organize subjects and track tasks with deadlines.

## Core Features

### Subjects Management
- Create subjects with name, description, and color
- View all subjects in a grid layout
- Each subject has its own color for easy identification

### Tasks Management
- Create tasks under each subject
- Set deadlines for tasks
- Track progress (0-100%)
- Mark tasks as completed

### Progress Tracking
- Visual progress bars for each subject
- Overall progress calculation
- Completion percentage display

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS
- **Backend**: Next.js API Routes (Route Handlers)
- **Database**: MongoDB with Prisma ORM

## Data Models

### Subject
| Field | Type | Description |
|-------|------|-------------|
| id | String | MongoDB ObjectId |
| name | String | Subject name (e.g., Math, CS) |
| description | String? | Optional description |
| color | String | Hex color for UI |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

### Task
| Field | Type | Description |
|-------|------|-------------|
| id | String | MongoDB ObjectId |
| title | String | Task title |
| description | String? | Optional description |
| completed | Boolean | Completion status |
| deadline | DateTime? | Task deadline |
| progress | Int | Progress percentage (0-100) |
| subjectId | String | Foreign key to Subject |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

## API Endpoints

### Subjects Endpoints
- `GET /api/subjects` - List all subjects with tasks
- `POST /api/subjects` - Create new subject
- `GET /api/subjects/[id]` - Get subject by ID
- `PUT /api/subjects/[id]` - Update subject
- `DELETE /api/subjects/[id]` - Delete subject

### Tasks Endpoints
- `GET /api/tasks` - List all tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks/[id]` - Get task by ID
- `PUT /api/tasks/[id]` - Update task
- `DELETE /api/tasks/[id]` - Delete task

## Complexity Level

This is an **intermediate** level project with:
- Nested data structure (Subject → Tasks)
- Progress tracking logic
- Multiple related models
- Full CRUD operations

## Getting Started

1. Install dependencies: `npm install`
2. Set up MongoDB and configure `.env`
3. Generate Prisma client: `npx prisma generate`
4. Push schema: `npm run db:push`
5. Seed data: `npm run db:seed`
6. Run dev server: `npm run dev`