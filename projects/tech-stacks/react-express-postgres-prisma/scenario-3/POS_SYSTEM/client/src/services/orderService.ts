import api from './api';
import { Order, PaymentMethod } from '../types';

export const orderService = {
  async getAll(date?: string): Promise<Order[]> {
    const response = await api.get<Order[]>('/orders', {
      params: date ? { date } : undefined,
    });
    return response.data;
  },

  async getById(id: number): Promise<Order> {
    const response = await api.get<Order>(`/orders/${id}`);
    return response.data;
  },

  async create(data: {
    items: { productId: number; quantity: number }[];
    paymentMethod: PaymentMethod;
    discount?: number;
  }): Promise<Order> {
    const response = await api.post<Order>('/orders', data);
    return response.data;
  },

  // TODO: Level 3 - Implement daily report endpoint
  // async getDailyReport(date: string): Promise<DailyReport> {
  //   const response = await api.get<DailyReport>(`/orders/report`, { params: { date } });
  //   return response.data;
  // },
};
