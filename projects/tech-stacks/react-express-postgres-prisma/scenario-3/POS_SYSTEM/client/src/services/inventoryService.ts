import api from './api';
import { Inventory } from '../types';

export const inventoryService = {
  async getAll(): Promise<Inventory[]> {
    const response = await api.get<Inventory[]>('/inventory');
    return response.data;
  },

  async getLowStock(): Promise<Inventory[]> {
    const response = await api.get<Inventory[]>('/inventory/low-stock');
    return response.data;
  },

  async adjustStock(
    productId: number,
    adjustment: number,
    reason?: string
  ): Promise<Inventory> {
    const response = await api.patch<Inventory>(`/inventory/${productId}/adjust`, {
      adjustment,
      reason,
    });
    return response.data;
  },

  async setStock(
    productId: number,
    quantity: number,
    lowStock?: number
  ): Promise<Inventory> {
    const response = await api.put<Inventory>(`/inventory/${productId}`, {
      quantity,
      lowStock,
    });
    return response.data;
  },
};
