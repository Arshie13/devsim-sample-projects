import api from './api';
import { Product } from '../types';

export const productService = {
  async getAll(params?: {
    search?: string;
    categoryId?: number;
    active?: boolean;
  }): Promise<Product[]> {
    const response = await api.get<Product[]>('/products', { params });
    return response.data;
  },

  async getById(id: number): Promise<Product> {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },

  async create(data: {
    name: string;
    price: number;
    sku: string;
    categoryId: number;
    active?: boolean;
  }): Promise<Product> {
    const response = await api.post<Product>('/products', data);
    return response.data;
  },

  async update(
    id: number,
    data: Partial<{
      name: string;
      price: number;
      sku: string;
      categoryId: number;
      active: boolean;
    }>
  ): Promise<Product> {
    const response = await api.put<Product>(`/products/${id}`, data);
    return response.data;
  },

  async deactivate(id: number): Promise<Product> {
    const response = await api.patch<Product>(`/products/${id}/deactivate`);
    return response.data;
  },
};
