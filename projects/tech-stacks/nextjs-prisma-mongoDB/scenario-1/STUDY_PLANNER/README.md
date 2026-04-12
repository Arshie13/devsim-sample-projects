# Study Planner

A Next.js application with Prisma and MongoDB for managing subjects and tasks.

## Features

- **Subjects Management**: Create, read, update, and delete subjects (Math, CS, Physics, etc.)
- **Tasks Management**: Create tasks under each subject with deadlines and progress tracking
- **Progress Tracking**: Visual progress bars showing completion percentage per subject and overall
- **Deadline Tracking**: View and manage task deadlines

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Prisma ORM

## Getting Started

### Prerequisites

- Node.js 18+
- Docker Desktop (for local MongoDB) or MongoDB Atlas account

### MongoDB Setup with Docker (Required)

Prisma requires MongoDB to run as a replica set. Use Docker for easy setup without installing MongoDB locally.

1. Install Docker Desktop

2. Start MongoDB:

```bash
docker-compose up -d
```

This automatically configures MongoDB with replica set and creates the necessary database user.

### Alternative: MongoDB Atlas

For cloud-hosted MongoDB without local setup:

1. Create a free account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a cluster and database user
3. Get your connection string and update `.env`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Generate Prisma client:
```bash
npx prisma generate
```

3. Push schema to database:
```bash
npm run db:push
```

4. (Optional) Seed the database with sample data:
```bash
npm run db:seed
```

### Running the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

### Subjects

- `GET /api/subjects` - List all subjects
- `POST /api/subjects` - Create a new subject
- `GET /api/subjects/[id]` - Get a specific subject
- `PUT /api/subjects/[id]` - Update a subject
- `DELETE /api/subjects/[id]` - Delete a subject

### Tasks

- `GET /api/tasks` - List all tasks
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/[id]` - Get a specific task
- `PUT /api/tasks/[id]` - Update a task (including progress and completion)
- `DELETE /api/tasks/[id]` - Delete a task

## Data Models

### Subject
- `id`: String (MongoDB ObjectId)
- `name`: String
- `description`: String?
- `color`: String (hex color)
- `createdAt`: DateTime
- `updatedAt`: DateTime
- `tasks`: Task[]

### Task
- `id`: String (MongoDB ObjectId)
- `title`: String
- `description`: String?
- `completed`: Boolean
- `deadline`: DateTime?
- `progress`: Int (0-100)
- `createdAt`: DateTime
- `updatedAt`: DateTime
- `subjectId`: String
- `subject`: Subject