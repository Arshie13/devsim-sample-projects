// User types
export interface User {
  id: number;
  email: string;
  name: string;
  role: 'ADMIN' | 'CASHIER';
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Category types
export interface Category {
  id: number;
  name: string;
  _count?: {
    products: number;
  };
}

// Product types
export interface Product {
  id: number;
  name: string;
  price: number;
  sku: string;
  active: boolean;
  categoryId: number;
  category?: Category;
  inventory?: Inventory;
  createdAt: string;
}

// Inventory types
export interface Inventory {
  id: number;
  productId: number;
  quantity: number;
  lowStock: number;
  product?: Product;
}

// Order types
export type PaymentMethod = 'CASH' | 'CARD';

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  product?: Product;
}

export interface Order {
  id: number;
  userId: number;
  user?: { id: number; name: string };
  items: OrderItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  createdAt: string;
}

// Cart types (for checkout)
export interface CartItem {
  product: Product;
  quantity: number;
}

// Store settings
export interface StoreSettings {
  id: number;
  name: string;
  address?: string;
  taxRate: number;
  cashEnabled: boolean;
  cardEnabled: boolean;
}

// API Error
export interface ApiError {
  message: string;
  status?: number;
}

// Report types
export interface DailyReport {
  date: string;
  totalSales: number;
  orderCount: number;
  topProducts: { product: Product; quantity: number }[];
}
