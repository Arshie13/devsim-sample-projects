import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateOrderDto) {
    let subtotal = 0;
    for (const item of dto.items) {
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        throw new NotFoundException(`Product ${item.productId} not found`);
      }

      subtotal += (item.price ?? product.price) * item.quantity;
    }

    const tax = 0;
    const discount = 0;
    const total = subtotal - discount + tax;

    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    return this.prisma.order.create({
      data: {
        orderNumber,
        user: {
          connect: { id: userId },
        },
        subtotal,
        tax,
        discount,
        total,
        shippingAddress: dto.shippingAddress,
        paymentMethod: dto.paymentMethod,
        items: {
          create: dto.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.price ?? 0,
            subtotal: (item.price ?? 0) * item.quantity,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto) {
    await this.findOne(id);

    return this.prisma.order.update({
      where: { id },
      data: { status: dto.status },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }
}
