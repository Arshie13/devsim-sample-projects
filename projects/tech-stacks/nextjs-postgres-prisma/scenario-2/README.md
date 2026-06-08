# Gym Member Portal

You are a full-stack developer at FitTech Systems, and you've been assigned to build a member portal for a fitness gym chain. The gym needs a system that lets members view their membership details, book classes, and check their attendance history. The frontend UI has been designed, but you need to connect it to the backend API and database to make it functional. Your task is to integrate the frontend with the backend services and ensure data flows correctly between all layers.

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

This will populate the database with a demo member, classes and bookings.

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

### Users

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID

### Memberships

- `GET /api/memberships` - Get all memberships
- `GET /api/memberships/:id` - Get membership by ID

### Classes

- `GET /api/classes` - Get all classes
- `GET /api/classes/:id` - Get class by ID

### Bookings

- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create new booking

### Attendances

- `GET /api/attendances` - Get all attendances

## 🗄️ Database Schema

### User

- user_id (UUID) - Primary key
- email (String) - Unique
- first_name (String)
- last_name (String)
- phone (String, optional)
- email_verified (Boolean)
- status (String)
- created_at (DateTime)

### Membership

- id (Int) - Primary key
- user_id (FK)
- type (String)
- status (String)
- start_date (DateTime)
- end_date (DateTime)

### Class

- id (Int) - Primary key
- name (String)
- schedule (String)
- instructor (String)
- capacity (Int)

### Booking

- id (Int) - Primary key
- user_id (FK)
- class_id (FK)
- booked_at (DateTime)

### Attendance

- id (Int) - Primary key
- user_id (FK)
- class_id (FK)
- attended_at (DateTime)

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
gym-member-portal/
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