import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateOrderDto, userId: string) {
    // Fetch products for the order
    const productIds = dto.items.map((item) => item.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
      include: { inventory: true },
    });

    if (products.length !== productIds.length) {
      throw new NotFoundException('One or more products not found or inactive');
    }

    // Calculate subtotal
    let subtotal = new Decimal(0);
    const orderItems = dto.items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        throw new NotFoundException(`Product ${item.productId} not found`);
      }

      const itemSubtotal = new Decimal(product.price.toString()).mul(item.quantity);
      subtotal = subtotal.add(itemSubtotal);

      return {
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: product.price,
        subtotal: itemSubtotal,
      };
    });

    // TODO: Implement tax calculation from Settings (Level 3, Task 3.1)
    // Currently tax is hardcoded to 0
    const tax = new Decimal(0);

    // TODO: Implement percentage discount calculation (Level 3, Task 3.1)
    // Currently discount is hardcoded to 0
    const discount = new Decimal(0);

    const total = subtotal.add(tax).sub(discount);

    // Generate order number
    const orderNumber = `ORD-${Date.now()}`;

    // TODO: Implement transactional stock deduction (Level 3, Task 3.2)
    // Currently the order is created WITHOUT deducting inventory
    // This should use prisma.$transaction to:
    // 1. Create order
    // 2. Deduct stock for each item
    // 3. Rollback if any step fails

    // TODO: Validate payment method against store settings (Level 3, Task 3.3)
    // Currently any payment method is accepted regardless of store settings

    const order = await this.prisma.order.create({
      data: {
        orderNumber,
        subtotal,
        tax,
        discount,
        total,
        paymentMethod: dto.paymentMethod,
        userId,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: {
          include: { product: true },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return order;
  }

  async findAll() {
    return this.prisma.order.findMany({
      include: {
        items: {
          include: { product: true },
        },
        user: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: { product: true },
        },
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async getDailySales() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.prisma.order.findMany({
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
      include: {
        items: {
          include: { product: true },
        },
        user: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
