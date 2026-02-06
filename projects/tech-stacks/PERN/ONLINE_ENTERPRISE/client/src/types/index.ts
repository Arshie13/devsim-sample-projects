// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'CUSTOMER';
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

// Product Types
export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  categoryId: string;
  category?: Category;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  categoryId: string;
}

// Cart Types
export interface CartItem {
  product: Product;
  quantity: number;
}

// Order Types
export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface OrderItem {
  id: string;
  orderId?: string;
  productId: string;
  product?: Product;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  user?: User;
  status: OrderStatus;
  total: number;
  address: string;
  items: OrderItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateOrderData {
  address: string;
  items: {
    productId: string;
    quantity: number;
  }[];
}

// Review Types
export interface Review {
  id: string;
  rating: number;
  comment: string;
  userId: string;
  user?: User;
  productId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateReviewData {
  rating: number;
  comment: string;
}

// API Response Types
export interface ApiError {
  message: string;
  status?: number;
}
