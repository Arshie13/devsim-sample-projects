import { Router } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

const orderItemSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().positive(),
});

const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1),
  paymentMethod: z.enum(['CASH', 'CARD']),
  discount: z.number().min(0).optional(),
});

// Get all orders (today by default)
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { date } = req.query;
    
    const startOfDay = date 
      ? new Date(String(date))
      : new Date(new Date().setHours(0, 0, 0, 0));
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);

    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
      include: {
        user: { select: { id: true, name: true } },
        items: {
          include: { product: { select: { id: true, name: true, sku: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(orders);
  } catch (error) {
    next(error);
  }
});

// Get single order
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        user: { select: { id: true, name: true } },
        items: {
          include: { product: true },
        },
      },
    });

    if (!order) {
      return next(new AppError('Order not found', 404));
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
});

// Create order (checkout)
router.post('/', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { items, paymentMethod, discount = 0 } = createOrderSchema.parse(req.body);

    // Get store settings for tax rate
    const settings = await prisma.storeSetting.findFirst();
    const taxRate = settings?.taxRate ? Number(settings.taxRate) : 0;

    // Calculate totals
    const productIds = items.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, active: true },
      include: { inventory: true },
    });

    if (products.length !== productIds.length) {
      return next(new AppError('Some products not found or inactive', 400));
    }

    // Check inventory
    for (const item of items) {
      const product = products.find((p: { id: number; }) => p.id === item.productId);
      if (product?.inventory && product.inventory.quantity < item.quantity) {
        return next(
          new AppError(`Insufficient stock for ${product.name}`, 400)
        );
      }
    }

    let subtotal = 0;
    const orderItems = items.map((item) => {
      const product = products.find((p: { id: number; }) => p.id === item.productId)!;
      const itemTotal = Number(product.price) * item.quantity;
      subtotal += itemTotal;
      return {
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      };
    });

    const tax = subtotal * (taxRate / 100);
    const total = subtotal + tax - discount;

    // Create order and update inventory in transaction
    const order = await prisma.$transaction(async (tx: { order: { create: (arg0: { data: { userId: number; subtotal: number; tax: number; discount: number; total: number; paymentMethod: "CASH" | "CARD"; items: { create: { productId: number; quantity: number; price: any; }[]; }; }; include: { items: { include: { product: boolean; }; }; user: { select: { id: boolean; name: boolean; }; }; }; }) => any; }; inventory: { update: (arg0: { where: { productId: number; }; data: { quantity: { decrement: number; }; }; }) => any; }; }) => {
      const newOrder = await tx.order.create({
        data: {
          userId: req.user!.id,
          subtotal,
          tax,
          discount,
          total,
          paymentMethod,
          items: { create: orderItems },
        },
        include: {
          items: { include: { product: true } },
          user: { select: { id: true, name: true } },
        },
      });

      // Update inventory
      for (const item of items) {
        await tx.inventory.update({
          where: { productId: item.productId },
          data: { quantity: { decrement: item.quantity } },
        });
      }

      return newOrder;
    });

    res.status(201).json(order);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(error.issues[0].message, 400));
    }
    next(error);
  }
});

// Daily sales report
router.get('/reports/daily', authenticate, async (req, res, next) => {
  try {
    const { date } = req.query;
    
    const startOfDay = date 
      ? new Date(String(date))
      : new Date(new Date().setHours(0, 0, 0, 0));
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);

    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
      include: {
        items: { include: { product: true } },
      },
    });

    const totalSales = orders.reduce((sum: number, order: { total: any; }) => sum + Number(order.total), 0);
    const totalOrders = orders.length;
    const totalTax = orders.reduce((sum: number, order: { tax: any; }) => sum + Number(order.tax), 0);

    // Top selling items
    const itemSales: Record<number, { name: string; quantity: number; revenue: number }> = {};
    orders.forEach((order: { items: any[]; }) => {
      order.items.forEach((item) => {
        if (!itemSales[item.productId]) {
          itemSales[item.productId] = {
            name: item.product.name,
            quantity: 0,
            revenue: 0,
          };
        }
        itemSales[item.productId].quantity += item.quantity;
        itemSales[item.productId].revenue += Number(item.price) * item.quantity;
      });
    });

    const topItems = Object.values(itemSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);

    res.json({
      date: startOfDay.toISOString().split('T')[0],
      totalSales,
      totalOrders,
      totalTax,
      topItems,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
