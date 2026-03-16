# BookWise - Library Management System

## Project Overview

**Client:** BookWise Public Library – a mid-sized community library modernizing its operations.

**Developer Role:** Junior Full Stack Developer at a software consultancy.

**Goal:** Build a full-featured web-based Library Management System for librarians to manage books, members, and borrowing workflows.

---

## Demo Credentials

| Role       | Email                  | Password     |
| ---------- | ---------------------- | ------------ |
| Librarian  | admin@bookwise.com     | password123  |

---

## Tech Stack (PERN)

| Layer        | Technology                              |
| ------------ | --------------------------------------- |
| **Database** | PostgreSQL + Prisma ORM                 |
| **Backend**  | Node.js + Express + TypeScript          |
| **Frontend** | React 18 + Vite + TypeScript            |
| **Styling**  | Tailwind CSS                            |
| **State**    | React Context API                       |
| **Validation** | Zod (client & server)                 |
| **Auth**     | JWT (JSON Web Tokens)                   |

---

## Features

### 📚 Library Catalog
- **Catalog Page:** Browse books with search and filters (title, author, genre).
- **Book Details:** Description, author info, availability status, shelf location.

### 🔐 Librarian Authentication
- Librarian login only.
- JWT-based session management.
- Role-based access (LIBRARIAN).

### 🔄 Borrowing System
- Borrow available books for members.
- Return borrowed books.
- Automatic due date calculation.
- Late return detection.

### 🛠️ Librarian Panel (Protected)
- **Books:** Add, edit, archive books.
- **Members:** View and manage member accounts.
- **Borrow Records:** Process borrows, process returns.
- **Availability:** Track copies and stock levels.

### 📊 Reports
- Most borrowed books.
- Overdue books report.
- Active members statistics.

---

## Data Models

### User (Librarian)
| Field      | Type     | Notes                    |
| ---------- | -------- | ------------------------ |
| id         | String   | UUID                     |
| email      | String   | Unique                   |
| password   | String   | Hashed                   |
| name       | String   |                          |
| role       | Enum     | LIBRARIAN                |
| createdAt  | DateTime |                          |

### Book
| Field       | Type     | Notes                    |
| ----------- | -------- | ------------------------ |
| id          | String   | UUID                     |
| title       | String   |                          |
| author      | String   |                          |
| genre       | String   |                          |
| description | String   |                          |
| isbn        | String   | Unique                   |
| totalCopies | Int      |                          |
| availableCopies | Int |                          |
| createdAt   | DateTime |                          |

### BorrowRecord
| Field      | Type     | Notes                              |
| ---------- | -------- | ---------------------------------- |
| id         | String   | UUID                               |
| userId     | String   | FK → User                          |
| bookId     | String   | FK → Book                          |
| borrowedAt | DateTime |                                    |
| dueDate    | DateTime |                                    |
| returnedAt | DateTime | Nullable                           |
| status     | Enum     | BORROWED, RETURNED, OVERDUE        |

---

## API Endpoints

### Auth
| Method | Endpoint              | Description           | Access |
| ------ | --------------------- | --------------------- | ------ |
| POST   | /api/auth/login       | Login                 | Public |
| GET    | /api/auth/me          | Get current user      | Auth   |

### Books
| Method | Endpoint              | Description            | Access      |
| ------ | --------------------- | ---------------------- | ----------- |
| GET    | /api/books            | List books             | Public      |
| GET    | /api/books/:id        | Book details           | Public      |
| POST   | /api/books            | Create book            | Librarian   |
| PUT    | /api/books/:id        | Update book            | Librarian   |
| DELETE | /api/books/:id        | Archive book           | Admin       |

### Borrowing
| Method | Endpoint                     | Description            | Access |
| ------ | ---------------------------- | ---------------------- | ------ |
| POST   | /api/borrow                  | Borrow a book          | Librarian |
| PATCH  | /api/borrow/:id/return       | Return a book          | Librarian |
| GET    | /api/borrow                  | All borrow records     | Librarian |

### Members
| Method | Endpoint              | Description            | Access |
| ------ | --------------------- | ---------------------- | ------ |
| GET    | /api/members          | List members           | Librarian |
| POST   | /api/members          | Create member          | Librarian |
| GET    | /api/members/:id      | Member details         | Librarian |
| PUT    | /api/members/:id      | Update member          | Librarian |

---

## Folder Structure

BOOKWISE/
├── client/
│ ├── src/
│ │ ├── components/
│ │ ├── context/
│ │ ├── pages/
│ │ │ ├── Home.tsx
│ │ │ ├── Catalog.tsx
│ │ │ ├── BookDetails.tsx
│ │ │ ├── dashboard/
│ │ │ └── admin/
│ │ ├── services/
│ │ ├── types/
│ │ └── App.tsx
│
├── server/
│ ├── prisma/
│ ├── src/
│ │ ├── routes/
│ │ ├── middleware/
│ │ └── index.ts
│
├── readme.md