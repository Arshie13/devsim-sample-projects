# BookWise - Library Management System

## Project Overview

**Client:** BookWise Public Library – a mid-sized community library modernizing its operations.

**Developer Role:** Junior Full Stack Developer at a software consultancy.

**Goal:** Build a full-featured web-based Library Management System to manage books, members, and borrowing workflows.

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

### 📚 Public Catalog
- **Homepage:** Library intro, featured books, announcements.
- **Catalog Page:** Browse books with search and filters (title, author, genre).
- **Book Details:** Description, author info, availability status, shelf location.

### 👤 Member Authentication
- Member registration and login.
- JWT-based session management.
- Role-based access (MEMBER / LIBRARIAN / ADMIN).

### 🔄 Borrowing System
- Borrow available books.
- Return borrowed books.
- Automatic due date calculation.
- Late return detection.

### 📖 Member Dashboard
- View currently borrowed books.
- See due dates and overdue warnings.
- Borrowing history.

### 🛠️ Librarian Panel (Protected)
- **Books:** Add, edit, archive books.
- **Members:** View and manage member accounts.
- **Borrow Records:** Approve borrows, process returns.
- **Availability:** Track copies and stock levels.

### 📊 Reports (Admin)
- Most borrowed books.
- Overdue books report.
- Active members statistics.

---

## Data Models

### User
| Field      | Type     | Notes                    |
| ---------- | -------- | ------------------------ |
| id         | String   | UUID                     |
| email      | String   | Unique                   |
| password   | String   | Hashed                   |
| name       | String   |                          |
| role       | Enum     | MEMBER, LIBRARIAN, ADMIN |
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
| POST   | /api/auth/register    | Register member       | Public |
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
| POST   | /api/borrow                  | Borrow a book          | Member |
| PATCH  | /api/borrow/:id/return       | Return a book          | Auth   |
| GET    | /api/borrow/my               | My borrow records     | Member |
| GET    | /api/borrow                  | All borrow records     | Librarian |

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
├── project.md
├── levels.md
└── instructions.md