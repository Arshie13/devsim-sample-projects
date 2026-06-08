# Employee Time Tracking

You are a full-stack developer at WorkPulse Inc., an HR software company. You're developing a time tracking system where employees clock in/out, log their work hours, and request time off. Managers need a dashboard to view team attendance, approve time-off requests, and generate payroll reports. Your task is to build the manager dashboard that aggregates employee time data from the backend and displays it in a meaningful, actionable format. (No need to make authentication and login as manager or employee, simply make the manager side.)

## 🚀 Tech Stack

- **Next.js** - React framework with App Router
- **Prisma** - ORM for PostgreSQL
- **PostgreSQL** - Database
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling

## 📋 Prerequisites

- Node.js 18+
- pnpm
- PostgreSQL database (or Docker for containerized setup)

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Generate Prisma Client

```bash
pnpm prisma:generate
```

### 3. Run Database Migrations

```bash
pnpm prisma:migrate
```

This will create all necessary tables in your database.

### 4. Seed Database (Optional)

```bash
pnpm prisma:seed
```

This will populate the database with sample employees, time entries and payroll data.

### 5. Start Development Server

```bash
pnpm dev
```

The application will start on `http://localhost:3000`

## 🐳 Docker Setup (Recommended)

Requires only Docker. No local Node, pnpm, or Postgres needed.

```bash
docker compose up
```

This builds the app image, starts Postgres, applies migrations, seeds the database, and starts the dev server on [http://localhost:3000](http://localhost:3000).

To run the graders inside the container:

```bash
docker compose exec app pnpm test:task:l1:t1
```

To start fresh (wipe the Postgres volume):

```bash
docker compose down -v
```

## 📚 API Endpoints

### Employees

- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get employee by ID

### Time Entries

- `GET /api/time-entries` - Get all time entries
- `GET /api/time-entries/:id` - Get time entry by ID

### Time Off Requests

- `GET /api/time-off-requests` - Get all time off requests
- `GET /api/time-off-requests/:id` - Get time off request by ID

### Payroll Records

- `GET /api/payroll-records` - Get all payroll records
- `GET /api/payroll-records/:id` - Get payroll record by ID

### Dashboard

- `GET /api/dashboard` - Get aggregated dashboard data

## 🗄️ Database Schema

### Employee

- id (Int) - Primary key
- email (String) - Unique
- first_name (String)
- last_name (String)
- role (String)
- manager_id (FK, optional)
- hourly_rate (Float, optional)
- created_at (String)

### TimeEntry

- id (Int) - Primary key
- employee_id (FK)
- clock_in (String)
- clock_out (String, optional)
- notes (String, optional)
- created_at (String)

### TimeOffRequest

- id (Int) - Primary key
- employee_id (FK)
- start_date (String)
- end_date (String)
- hours (Float)
- request_type (String)
- status (String)
- notes (String, optional)
- reviewed_by (FK, optional)
- reviewed_at (String, optional)
- created_at (String)

### PayrollPeriod

- id (Int) - Primary key
- start_date (String)
- end_date (String)
- status (String)
- processed_at (String, optional)
- created_at (String)

### PayrollRecord

- id (Int) - Primary key
- payroll_period_id (FK)
- employee_id (FK)
- regular_hours (Float)
- overtime_hours (Float)
- total_hours (Float)
- hourly_rate (Float)
- gross_pay (Float)
- created_at (String)

## 🔧 Available Commands

```bash
# Development
pnpm dev              # Start dev server

# Build
pnpm build           # Build for production
pnpm start           # Run production server

# Prisma
pnpm prisma:generate # Generate Prisma Client
pnpm prisma:migrate  # Run migrations
pnpm prisma:seed     # Seed database
pnpm prisma:studio   # Open Prisma Studio (DB GUI)

# Testing
pnpm test             # Run all tests
pnpm test:task:l1:t1  # Run specific task test
```

## 📁 Project Structure

```
employee-time-tracking/
├── src/
│   ├── app/
│   │   ├── api/           # API route handlers
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── lib/
│       └── prisma.ts      # Prisma client instance
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Database seed script
├── tests/
│   └── level-1/
│       └── task-1/        # Test files
└── package.json
```

## 📄 License

ISC