# Student Portal

You are tasked to make a student's portal for a school. The portal should include a directory where the student can view their grades, view their class schedule, view their tuition fees, and view their current standing.

For this demo: the student ID is 12-346-78, and the password is: sample

## 🚀 Tech Stack

- **Next.js** - React framework with App Router
- **shadcn/ui** - UI component library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling

## 📋 Prerequisites

- Node.js 18+
- pnpm

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Start Development Server

```bash
pnpm dev
```

The application will start on `http://localhost:3000`

## 🔧 Available Commands

```bash
# Development
pnpm dev                   # Start the dev server

# Testing
pnpm run test:run                  # Run all tests
pnpm run test:task:l1:t1            # Run specific task test
pnpm run test:task:l1:t2            # Run specific task test
```

## 📁 Project Structure

```
student-portal/
├── package.json         # Next.js application
├── src/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── login/
│   │   └── dashboard/
│   │       ├── layout.tsx
│   │       ├── page.tsx
│   │       ├── grades/
│   │       ├── schedule/
│   │       ├── fees/
│   │       └── standing/
│   ├── components/
│   └── lib/
└── tests/
    └── level-1/
        └── task-1/        # Test files
```

## 📄 License

ISC