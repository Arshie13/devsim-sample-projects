# Customer Support City Hall

Your scrum master assigned the task of creating a frontend page for the project. The project is making a customer support chat system for the local City Hall. The page should have a chat with both an AI helper and a redirection system to talk to a real customer support agent. It also includes a side for both the person agent and the client, so a form for the customer support agent should be in place, such as who the person is, where they live within the city, and what their complaint/query is.

For this demonstration, the support agent credentials are:
- username: admin
- password: admin123

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
cd client && pnpm install && cd ..
```

### 2. Start Development Server

```bash
pnpm run dev:client
```

The application will start on `http://localhost:3000`

## 🔧 Available Commands

```bash
# Development
pnpm run dev:client       # Start client dev server

# Testing
pnpm run test:run                  # Run all tests
pnpm run test:task:client:l1:t1     # Run specific task test
pnpm run test:task:client:l1:t2     # Run specific task test
```

## 📁 Project Structure

```
customer-support-city-hall/
├── package.json         # Root orchestrator
├── client/            # Next.js application
│   ├── package.json
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx
│   │   │   ├── support/
│   │   │   ├── agent/
│   │   │   └── agent/login/
│   │   └── components/
│   └── tests/
└── tests/
    └── client/
        └── level-1/
            └── task-1/        # Test files
```

## 📄 License

ISC