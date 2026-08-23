# UrbanPottery - Enterprise E-Commerce Platform

## Project Overview

**Client:** UrbanPottery - A local artisanal ceramics company expanding to online direct-to-consumer sales.

**Developer Role:** Junior Full Stack Developer at a software consultancy.

**Goal:** Build a robust, scalable single-merchant e-commerce web application.

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

### 🛍️ Public Storefront
- **Homepage:** Hero banner, featured products, category highlights.
- **Shop Page:** Product grid with category filtering and search.
- **Product Details:** Full product info, image gallery, stock status, "Add to Cart".

### 🛒 Shopping Cart
- Persistent cart (localStorage + Context).
- Quantity adjustments with stock validation.
- Cart drawer/sidebar for quick access.

### 👤 User Authentication
- Customer registration and login.
- JWT-based session management.
- Role-based access (CUSTOMER / ADMIN).

### 📦 Checkout Flow
- Shipping address form.
- Order summary review.
- Simulated payment processing.
- Order confirmation with details.

### 🔐 Admin Panel (Protected)
- **Dashboard:** Sales overview, recent orders, low-stock alerts.
- **Products:** CRUD operations (Create, Read, Update, Delete).
- **Orders:** View all orders, update status (Pending → Shipped → Delivered).
- **Inventory:** Stock level management.

### 📊 Reporting (Admin)
- Daily/weekly sales totals.
- Top-selling products.

---

## Data Models

### User
| Field      | Type     | Notes                    |
| ---------- | -------- | ------------------------ |
| id         | String   | UUID                     |
| email      | String   | Unique                   |
| password   | String   | Hashed                   |
| name       | String   |                          |
| role       | Enum     | CUSTOMER, ADMIN          |
| createdAt  | DateTime |                          |

### Product
| Field       | Type     | Notes                    |
| ----------- | -------- | ------------------------ |
| id          | String   | UUID                     |
| name        | String   |                          |
| description | String   |                          |
| price       | Decimal  |                          |
| image       | String   | URL                      |
| categoryId  | String   | FK → Category            |
| stock       | Int      |                          |
| createdAt   | DateTime |                          |

### Category
| Field | Type   | Notes  |
| ----- | ------ | ------ |
| id    | String | UUID   |
| name  | String | Unique |

### Order
| Field      | Type     | Notes                              |
| ---------- | -------- | ---------------------------------- |
| id         | String   | UUID                               |
| userId     | String   | FK → User                          |
| status     | Enum     | PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED |
| total      | Decimal  |                                    |
| address    | String   | Shipping address                   |
| createdAt  | DateTime |                                    |

### OrderItem
| Field     | Type    | Notes         |
| --------- | ------- | ------------- |
| id        | String  | UUID          |
| orderId   | String  | FK → Order    |
| productId | String  | FK → Product  |
| quantity  | Int     |               |
| price     | Decimal | Price at time of order |

---

## API Endpoints

### Auth
| Method | Endpoint         | Description          | Access   |
| ------ | ---------------- | -------------------- | -------- |
| POST   | /api/auth/register | Register new user  | Public   |
| POST   | /api/auth/login    | Login user         | Public   |
| GET    | /api/auth/me       | Get current user   | Auth     |

### Products
| Method | Endpoint              | Description           | Access   |
| ------ | --------------------- | --------------------- | -------- |
| GET    | /api/products         | List all products     | Public   |
| GET    | /api/products/:id     | Get product details   | Public   |
| POST   | /api/products         | Create product        | Admin    |
| PUT    | /api/products/:id     | Update product        | Admin    |
| DELETE | /api/products/:id     | Delete product        | Admin    |

### Categories
| Method | Endpoint              | Description           | Access   |
| ------ | --------------------- | --------------------- | -------- |
| GET    | /api/categories       | List all categories   | Public   |
| POST   | /api/categories       | Create category       | Admin    |

### Orders
| Method | Endpoint              | Description           | Access   |
| ------ | --------------------- | --------------------- | -------- |
| GET    | /api/orders           | List orders           | Admin (all) / User (own) |
| GET    | /api/orders/:id       | Get order details     | Auth     |
| POST   | /api/orders           | Create order          | Auth     |
| PATCH  | /api/orders/:id/status | Update order status  | Admin    |

---

## Folder Structure

```
ONLINE_ENTERPRISE/
├── client/                 # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/     # Navbar, Footer, Layout
│   │   │   └── ui/         # Button, Input, Card, Modal, etc.
│   │   ├── context/        # AuthContext, CartContext
│   │   ├── hooks/          # Custom hooks
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── Shop.tsx
│   │   │   ├── ProductDetails.tsx
│   │   │   ├── Cart.tsx
│   │   │   ├── Checkout.tsx
│   │   │   ├── auth/       # Login, Register
│   │   │   └── admin/      # Dashboard, Products, Orders
│   │   ├── services/       # API calls
│   │   ├── types/          # TypeScript interfaces
│   │   ├── utils/          # Helper functions
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── server/                 # Express Backend
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── lib/            # Prisma client
│   │   ├── middleware/     # Auth, Error handling
│   │   ├── routes/         # API routes
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
│
├── project.md              # This file
├── levels.md               # Developer challenges
└── instructions.md         # Setup prompt
```
