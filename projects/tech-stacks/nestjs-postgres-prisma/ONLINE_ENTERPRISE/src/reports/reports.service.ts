import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getDailySales() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const orders = await this.prisma.order.findMany({
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
        status: {
          in: [OrderStatus.PROCESSING, OrderStatus.SHIPPED, OrderStatus.DELIVERED],
        },
      },
      include: {
        items: true,
      },
    });

    const totalSales = orders.reduce((sum, order) => sum + Number(order.total), 0);
    const totalOrders = orders.length;
    const totalItems = orders.reduce(
      (sum, order) => sum + order.items.reduce((s, item) => s + item.quantity, 0),
      0,
    );

    return {
      date: today.toISOString().split('T')[0],
      totalSales,
      totalOrders,
      totalItems,
      orders,
    };
  }

  async getWeeklySales() {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const orders = await this.prisma.order.findMany({
      where: {
        createdAt: {
          gte: weekAgo,
        },
        status: {
          in: [OrderStatus.PROCESSING, OrderStatus.SHIPPED, OrderStatus.DELIVERED],
        },
      },
      include: {
        items: true,
      },
    });

    const totalSales = orders.reduce((sum, order) => sum + Number(order.total), 0);
    const totalOrders = orders.length;
    const totalItems = orders.reduce(
      (sum, order) => sum + order.items.reduce((s, item) => s + item.quantity, 0),
      0,
    );

    return {
      period: 'Last 7 days',
      startDate: weekAgo.toISOString().split('T')[0],
      endDate: today.toISOString().split('T')[0],
      totalSales,
      totalOrders,
      totalItems,
      orders,
    };
  }

  async getMonthlySales() {
    const today = new Date();
    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    const orders = await this.prisma.order.findMany({
      where: {
        createdAt: {
          gte: monthAgo,
        },
        status: {
          in: [OrderStatus.PROCESSING, OrderStatus.SHIPPED, OrderStatus.DELIVERED],
        },
      },
      include: {
        items: true,
      },
    });

    const totalSales = orders.reduce((sum, order) => sum + Number(order.total), 0);
    const totalOrders = orders.length;
    const totalItems = orders.reduce(
      (sum, order) => sum + order.items.reduce((s, item) => s + item.quantity, 0),
      0,
    );

    return {
      period: 'Last 30 days',
      startDate: monthAgo.toISOString().split('T')[0],
      endDate: today.toISOString().split('T')[0],
      totalSales,
      totalOrders,
      totalItems,
      orders,
    };
  }

  async getTopProducts(limit: number = 10) {
    const orderItems = await this.prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true,
      },
      _count: {
        productId: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: limit,
    });

    const productsWithStats = await Promise.all(
      orderItems.map(async (item) => {
        const product = await this.prisma.product.findUnique({
          where: { id: item.productId },
          include: { category: true },
        });

        return {
          product,
          totalSold: item._sum.quantity,
          orderCount: item._count.productId,
        };
      }),
    );

    return productsWithStats;
  }
}
