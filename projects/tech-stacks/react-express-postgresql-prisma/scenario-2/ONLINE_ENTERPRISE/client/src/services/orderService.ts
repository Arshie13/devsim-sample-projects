// import api from './api';
import type { Order, CreateOrderData } from '../types';
import { mockOrders, mockProducts, mockUser, delay } from '../data';

// Using mock data - will connect to API later
const orders = [...mockOrders];

export const orderService = {
  async getAll(): Promise<Order[]> {
    await delay(300);
    return orders;
  },

  async getById(id: string): Promise<Order> {
    await delay(200);
    const order = orders.find(o => o.id === id);
    if (!order) throw new Error('Order not found');
    return order;
  },

  async create(data: CreateOrderData): Promise<Order> {
    await delay(500);
    const items = data.items.map((item, index) => {
      const product = mockProducts.find(p => p.id === item.productId);
      return {
        id: `item-${Date.now()}-${index}`,
        orderId: `ord-${Date.now()}`,
        productId: item.productId,
        product,
        quantity: item.quantity,
        price: product?.price || 0,
      };
    });

    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      userId: mockUser.id,
      user: mockUser,
      status: 'PENDING',
      total,
      address: data.address,
      items,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    orders.unshift(newOrder);
    return newOrder;
  },

  async updateStatus(id: string, status: string): Promise<Order> {
    await delay(300);
    const index = orders.findIndex(o => o.id === id);
    if (index === -1) throw new Error('Order not found');
    orders[index] = { ...orders[index], status: status as Order['status'], updatedAt: new Date().toISOString() };
    return orders[index];
  },

  async getMyOrders(): Promise<Order[]> {
    await delay(300);
    return orders;
  },
};

export default orderService;
