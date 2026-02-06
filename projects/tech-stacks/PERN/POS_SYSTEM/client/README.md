# POS System - Client

React + TypeScript + Vite frontend for the POS System.

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Styling
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Lucide React** - Icons

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# From the client directory
npm install

# Start development server
npm run dev
```

The client will run on `http://localhost:3000` and proxy API requests to `http://localhost:5000`.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
client/
├── public/             # Static assets
├── src/
│   ├── components/     # Reusable UI components
│   │   ├── layout/     # Layout components (Sidebar, Layout)
│   │   └── ui/         # Base UI components (Button, Input, Modal, etc.)
│   ├── context/        # React Context providers
│   │   ├── AuthContext.tsx   # Authentication state
│   │   └── CartContext.tsx   # Shopping cart state
│   ├── pages/          # Page components
│   │   ├── auth/       # Login & Register
│   │   ├── dashboard/  # Dashboard
│   │   ├── pos/        # POS/Checkout
│   │   ├── products/   # Product management
│   │   ├── categories/ # Category management
│   │   ├── orders/     # Order history
│   │   ├── inventory/  # Inventory management
│   │   ├── reports/    # Sales reports
│   │   └── settings/   # Store settings
│   ├── services/       # API service layer
│   ├── types/          # TypeScript type definitions
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

1. **Authentication** - Admin and cashier login with role-based access
2. **Product Catalog** - CRUD operations for products with categories
3. **Inventory** - Stock tracking with low-stock alerts
4. **POS/Checkout** - Add items to cart, apply discounts, process payments
5. **Orders** - View daily sales history with details
6. **Receipts** - Printable receipt view
7. **Reports** - Daily totals and top-selling products
8. **Settings** - Store configuration (admin only)

## Environment

The client uses Vite's proxy configuration to forward `/api` requests to the backend server running on port 5000.
