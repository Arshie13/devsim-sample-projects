# Library Management

You are hired by SM Tech Solutions to make a frontend page for their current project. Their current project is a library book management system that tracks the books borrowed in the library. The frontend should include the list of books in the library, books that are borrowed are labeled as "Borrowed", which books are overdue to be returned, who borrowed that book, a login page and a signup page for the librarians.

For this level, here is a demo user and password that should work on your project:
- Username: admin
- Password: admin123

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
library-management/
├── package.json         # Next.js application
├── src/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── login/
│   │   ├── signup/
│   │   └── dashboard/
│   ├── components/
│   └── lib/
└── tests/
    └── level-1/
        └── task-1/        # Test files
```

## 📄 License

ISC