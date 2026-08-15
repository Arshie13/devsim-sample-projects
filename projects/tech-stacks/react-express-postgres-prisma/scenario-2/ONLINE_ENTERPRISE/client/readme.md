# UrbanPottery - Client

React + TypeScript + Vite frontend for the UrbanPottery E-Commerce Platform.

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Styling
- **React Router** - Client-side routing
- **Axios** - HTTP client

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm

### Installation

```bash
# From the client directory
pnpm install

# Start development server
pnpm run dev
```

The client will run on `http://localhost:5173` and proxy API requests to `http://localhost:5000`.

### Available Scripts

- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run preview` - Preview production build
- `pnpm run lint` - Run ESLint

## Project Structure

```
client/
├── public/             # Static assets
├── src/
│   ├── components/     # Reusable UI components
│   │   ├── layout/     # Layout components (Navbar, Footer, Layout)
│   │   └── ui/         # Base UI components (Button, Input, Card, Modal, etc.)
│   ├── context/        # React Context providers
│   │   ├── AuthContext.tsx   # Authentication state
│   │   └── CartContext.tsx   # Shopping cart state
│   ├── hooks/          # Custom hooks
│   ├── pages/          # Page components
│   │   ├── Home.tsx
│   │   ├── Shop.tsx
│   │   ├── ProductDetails.tsx
│   │   ├── Cart.tsx
│   │   ├── Checkout.tsx
│   │   ├── auth/       # Login, Register
│   │   └── admin/      # Dashboard, Products, Orders
│   ├── services/       # API service layer
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Helper functions
│   ├── App.tsx         # Main app component with routing
│   ├── main.tsx        # Entry point
│   └── index.css       # Global styles
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## Features

1. **Public Storefront** - Homepage, shop page with product grid, product details
2. **Shopping Cart** - Persistent cart with quantity adjustments and stock validation
3. **User Authentication** - Customer registration and login with JWT
4. **Checkout Flow** - Shipping address, order summary, simulated payment
5. **Admin Panel** - Dashboard, product CRUD, order management, inventory management

## Environment

The client uses Vite's proxy configuration to forward `/api` requests to the backend server running on port 5000.
