# Library Management System - Server API

Backend API for the Library Management System built with the PERN stack (PostgreSQL, Express, React, Node.js).

## 🚀 Tech Stack

- **Node.js** with **TypeScript**
- **Express.js** - Web framework
- **Prisma** - ORM for PostgreSQL
- **PostgreSQL** - Database
- **Zod** - Schema validation
- **CORS** - Cross-origin resource sharing

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2 Generate Prisma Client

```bash
npm run prisma:generate
```

### 3. Run Database Migrations

```bash
npm run prisma:migrate
```

This will create all necessary tables in your database.

### 4. Seed Database (Optional)

```bash
npm run db:seed
```

This will populate the database with sample data for testing.

### 5. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:5000`

## 📚 API Endpoints

### Authentication

- `POST /api/auth/login` - Librarian login
- `POST /api/auth/logout` - Librarian logout (requires authentication)
- `GET /api/auth/me` - Get current logged in librarian (requires authentication)

### Health Check

- `GET /health` - Server health check

### Books

- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get book by ID
- `GET /api/books/search?q=query` - Search books by title, author, or ISBN
- `POST /api/books` - Create new book (requires authentication)
- `PUT /api/books/:id` - Update book (requires authentication)
- `DELETE /api/books/:id` - Delete book (requires authentication)

### Members

- `GET /api/members` - Get all members (requires authentication)
- `GET /api/members/:id` - Get member by ID (requires authentication)
- `POST /api/members` - Create new member (requires authentication)
- `PUT /api/members/:id` - Update member (requires authentication)
- `DELETE /api/members/:id` - Delete member (requires authentication)

### Borrow Records

- `GET /api/borrow-records` - Get all borrow records (requires authentication)
- `GET /api/borrow-records/:id` - Get borrow record by ID (requires authentication)
- `GET /api/borrow-records/overdue` - Get overdue records (requires authentication)
- `POST /api/borrow-records/member` - Borrow book for registered member (requires authentication)
- `POST /api/borrow-records/walk-in` - Borrow book for walk-in borrower (requires authentication)
- `PUT /api/borrow-records/:id/return` - Return borrowed book (requires authentication)

## 📝 API Request/Response Examples

### Login

**POST** `/api/auth/login`

```json
{
  "email": "librarian@library.com",
  "password": "your-password"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "email": "librarian@library.com",
      "name": "John Librarian",
      "role": "LIBRARIAN"
    }
  },
  "message": "Login successful"
}
```

### Create Book

**POST** `/api/books`

```json
{
  "title": "The Pragmatic Programmer",
  "author": "David Thomas, Andrew Hunt",
  "genre": "Technology",
  "description": "Your journey to mastery",
  "isbn": "978-0-201-61622-4",
  "totalCopies": 5,
  "availableCopies": 5
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "The Pragmatic Programmer",
    "author": "David Thomas, Andrew Hunt",
    "genre": "Technology",
    "description": "Your journey to mastery",
    "isbn": "978-0-201-61622-4",
    "totalCopies": 5,
    "availableCopies": 5,
    "createdAt": "2026-02-11T10:30:00.000Z",
    "updatedAt": "2026-02-11T10:30:00.000Z"
  },
  "message": "Book created successfully"
}
```

### Create Member

**POST** `/api/members`

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "idNumber": "ID-12345",
  "idPhoto": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
}
```

### Borrow Book (Member)

**POST** `/api/borrow-records/member`

```json
{
  "bookId": "book-uuid",
  "memberId": "member-uuid",
  "dueDate": "2026-02-25T00:00:00.000Z"
}
```

### Borrow Book (Walk-in)

**POST** `/api/borrow-records/walk-in`

```json
{
  "bookId": "book-uuid",
  "dueDate": "2026-02-18T00:00:00.000Z",
  "walkInBorrower": {
    "name": "Jane Visitor",
    "email": "jane@example.com",
    "phone": "+1234567891",
    "idNumber": "ID-W001",
    "idPhoto": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
  }
}
```

### Return Book

**PUT** `/api/borrow-records/:id/return`

No request body required.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "record-uuid",
    "bookId": "book-uuid",
    "borrowerType": "MEMBER",
    "memberId": "member-uuid",
    "borrowedAt": "2026-02-11T10:00:00.000Z",
    "dueDate": "2026-02-25T00:00:00.000Z",
    "returnedAt": "2026-02-11T15:30:00.000Z",
    "status": "RETURNED"
  },
  "message": "Book returned successfully"
}
```

## 🔐 Authentication

This API uses JWT (JSON Web Token) for authentication. All protected endpoints require a valid Bearer token in the Authorization header.

### Getting a Token

1. Login with your librarian credentials at `POST /api/auth/login`
2. The response will include a JWT token
3. Include the token in subsequent requests:

```
Authorization: Bearer <your-token-here>
```

### User Roles

- **ADMIN** - Full system access
- **LIBRARIAN** - Manage books, members, and borrow records

## 🗄️ Database Schema

### User
- id (UUID)
- email (unique)
- password (hashed)
- name
- role ('ADMIN' | 'LIBRARIAN')
- createdAt
- updatedAt

### Book
- id (UUID)
- title
- author
- genre
- description
- isbn (unique)
- totalCopies
- availableCopies
- createdAt
- updatedAt

### Member
- id (UUID)
- name
- email (unique)
- phone
- idNumber
- idPhoto (Base64)
- createdAt
- updatedAt

### WalkInBorrower
- id (UUID)
- name
- email
- phone
- idNumber
- idPhoto (Base64)
- createdAt
- updatedAt

### BorrowRecord
- id (UUID)
- bookId (FK)
- borrowerType ('MEMBER' | 'WALK_IN')
- memberId (FK, nullable)
- walkInBorrowerId (FK, nullable)
- borrowedAt
- dueDate
- returnedAt (nullable)
- status ('BORROWED' | 'RETURNED' | 'OVERDUE')
- createdAt
- updatedAt

## 🔧 Available Commands

```bash
# Development
npm run dev              # Start dev server with hot reload

# Build
npm run build           # Compile TypeScript to JavaScript

# Production
npm start               # Run production server

# Prisma
npm run prisma:generate # Generate Prisma Client
npm run prisma:migrate  # Run migrations
npm run prisma:studio   # Open Prisma Studio (DB GUI)
npm run prisma:push     # Push schema without migrations
npm run prisma:reset    # Reset database

# Database
npm run db:seed         # Seed database with sample data
```

## 🚨 Error Handling

All API errors return in the following format:

```json
{
  "success": false,
  "error": "Error message",
  "message": "Additional context (optional)"
}
```

Status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized (invalid or missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## 🔄 Status Flow

### Borrow Record Status
1. **BORROWED** - Initial state when book is borrowed
2. **OVERDUE** - Automatically set when current date > dueDate
3. **RETURNED** - Set when book is returned


## 🔄 Future Enhancements

- [ ] Email notifications for overdue books
- [ ] Rate limiting
- [ ] API documentation with Swagger
- [ ] Unit and integration tests

## 📄 License

ISC

---

**Note:** This API is ready to connect to the frontend but is currently running independently. Update the client's service layer to point to `http://localhost:5000/api` when ready to integrate.
