# Study Planner

A Next.js application with Prisma and PostgreSQL for managing subjects and tasks.

## Features

- **Subjects Management**: Create, read, update, and delete subjects (Math, CS, Physics, etc.)
- **Tasks Management**: Create tasks under each subject with deadlines and progress tracking
- **Progress Tracking**: Visual progress bars showing completion percentage per subject and overall
- **Deadline Tracking**: View and manage task deadlines

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM

## Getting Started

### Prerequisites

- Node.js 18+
- Docker Desktop (for local PostgreSQL) or any PostgreSQL instance

### PostgreSQL Setup with Docker (Recommended)

Use Docker for an easy local PostgreSQL setup without installing PostgreSQL directly.

1. Install Docker Desktop

2. Start PostgreSQL:

```bash
docker-compose up -d
```

This starts a PostgreSQL container with the database and credentials defined in `docker-compose.yml`.

### Alternative: Hosted PostgreSQL

For cloud-hosted PostgreSQL without local setup (e.g. Neon, Supabase, Railway):

1. Create a database with your provider
2. Get the connection string and update `DATABASE_URL` in `.env`

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
- `id`: String (cuid)
- `name`: String
- `description`: String?
- `color`: String (hex color)
- `createdAt`: DateTime
- `updatedAt`: DateTime
- `tasks`: Task[]

### Task
- `id`: String (cuid)
- `title`: String
- `description`: String?
- `completed`: Boolean
- `deadline`: DateTime?
- `progress`: Int (0-100)
- `createdAt`: DateTime
- `updatedAt`: DateTime
- `subjectId`: String
- `subject`: Subject
