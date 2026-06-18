# UrbanPottery - Server

Node.js + Express + TypeScript backend for the UrbanPottery E-Commerce Platform.

## Tech Stack

- **Node.js** - Runtime environment
- **Express** - Web framework
- **TypeScript** - Type safety
- **Prisma** - ORM for PostgreSQL
- **PostgreSQL** - Database
- **Zod** - Schema validation
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL installed and running

### Environment Variables

Create a `.env` file in the server directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/urbanpottery?schema=public"

# JWT
JWT_SECRET="your_super_secret_jwt_key_here"
JWT_EXPIRES_IN="7d"

# Server
PORT=5000
NODE_ENV=development
```

### Installation

```bash
# From the server directory
npm install

# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# (Optional) Seed the database
npm run db:seed

# Start development server
npm run dev
```

The server will run on `http://localhost:5000`.

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server
- `npm run db:migrate` - Run Prisma migrations
- `npm run db:generate` - Generate Prisma client
- `npm run db:studio` - Open Prisma Studio
- `npm run db:seed` - Seed database with sample data

## Project Structure

```
server/
├── prisma/
│   ├── schema.prisma       # Database schema
│   ├── migrations/         # Migration files
│   └── seed.ts             # Seed script
│
├── src/
│   ├── lib/
│   │   └── prisma.ts       # Prisma client instance
│   │
│   ├── middleware/
│   │   ├── auth.ts         # JWT authentication
│   │   ├── adminOnly.ts    # Admin role check
│   │   └── errorHandler.ts # Global error handling
│   │
│   ├── routes/
│   │   ├── auth.ts         # Authentication routes
│   │   ├── products.ts     # Product CRUD
│   │   ├── categories.ts   # Category management
│   │   ├── orders.ts       # Order processing
│   │   └── reviews.ts      # Product reviews
│   │
│   └── index.ts            # Entry point
│
├── .env                    # Environment variables
├── package.json
└── tsconfig.json
```

## API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint   | Description        | Access |
| ------ | ---------- | ------------------ | ------ |
| POST   | /register  | Register new user  | Public |
| POST   | /login     | Login user         | Public |
| GET    | /me        | Get current user   | Auth   |

### Products (`/api/products`)
| Method | Endpoint | Description      | Access |
| ------ | -------- | ---------------- | ------ |
| GET    | /        | List all products | Public |
| GET    | /:id     | Get product by ID | Public |
| POST   | /        | Create product    | Admin  |
| PUT    | /:id     | Update product    | Admin  |
| DELETE | /:id     | Delete product    | Admin  |

### Categories (`/api/categories`)
| Method | Endpoint | Description       | Access |
| ------ | -------- | ----------------- | ------ |
| GET    | /        | List categories   | Public |
| POST   | /        | Create category   | Admin  |

### Orders (`/api/orders`)
| Method | Endpoint     | Description          | Access |
| ------ | ------------ | -------------------- | ------ |
| GET    | /            | List orders          | Auth   |
| GET    | /:id         | Get order details    | Auth   |
| POST   | /            | Create order         | Auth   |
| PATCH  | /:id/status  | Update order status  | Admin  |

### Reviews (`/api/products/:productId/reviews`)
| Method | Endpoint | Description      | Access |
| ------ | -------- | ---------------- | ------ |
| GET    | /        | Get reviews      | Public |
| POST   | /        | Create review    | Auth   |

## Database Schema

### User
```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String
  role      Role     @default(CUSTOMER)
  orders    Order[]
  reviews   Review[]
  createdAt DateTime @default(now())
}

enum Role {
  ADMIN
  CUSTOMER
}
```

### Product
```prisma
model Product {
  id          String      @id @default(uuid())
  name        String
  description String
  price       Decimal     @db.Decimal(10, 2)
  image       String
  stock       Int         @default(0)
  categoryId  String
  category    Category    @relation(fields: [categoryId], references: [id])
  orderItems  OrderItem[]
  reviews     Review[]
  createdAt   DateTime    @default(now())
}
```

### Order
```prisma
model Order {
  id        String      @id @default(uuid())
  userId    String
  user      User        @relation(fields: [userId], references: [id])
  status    OrderStatus @default(PENDING)
  total     Decimal     @db.Decimal(10, 2)
  address   String
  items     OrderItem[]
  createdAt DateTime    @default(now())
}

enum OrderStatus {
  PENDING
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}
```

## Error Handling

The server uses a centralized error handler. Throw `AppError` for custom errors:

```typescript
import { AppError } from '../middleware/errorHandler';

// Usage in routes
throw new AppError('Product not found', 404);
```

## Authentication

JWT tokens are used for authentication:

1. User logs in with email/password.
2. Server returns a JWT token.
3. Client includes token in `Authorization: Bearer <token>` header.
4. `authenticate` middleware verifies the token.
5. `adminOnly` middleware checks for ADMIN role.
