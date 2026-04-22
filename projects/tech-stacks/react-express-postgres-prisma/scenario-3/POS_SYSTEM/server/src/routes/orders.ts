import { Router } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { authenticate, AuthRequest } from '../middleware/auth';
import { voidOrderHandler } from '../controllers/order.controller';
import { revenueWhereClause } from '../utils/revenueUtils';

const router = Router();

const orderItemSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().positive(),
});

const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1),
  paymentMethod: z.enum(['CASH', 'CARD']),
  discount: z.number().min(0).optional(),
  promoCode: z.string().optional(),
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
        createdAt: { gte: startOfDay, lt: endOfDay },
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

// Daily sales report — revenue excludes voided orders via source-of-truth `voidedAt IS NULL`.
// Note: do NOT filter only by status — an admin can flip status back to COMPLETED while
// voidedAt still holds the cancellation timestamp. See server/POSTMORTEM_REVENUE.md.
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
        createdAt: { gte: startOfDay, lt: endOfDay },
        voidedAt: null,
      },
      include: { items: { include: { product: true } } },
    });

    const totalSales = orders.reduce(
      (sum: number, order: { total: unknown }) => sum + Number(order.total),
      0
    );
    const totalOrders = orders.length;
    const totalTax = orders.reduce(
      (sum: number, order: { tax: unknown }) => sum + Number(order.tax),
      0
    );

    const itemSales: Record<number, { name: string; quantity: number; revenue: number }> = {};
    orders.forEach((order: { items: any[] }) => {
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

// Stats endpoint — aggregate revenue-eligible orders only (source-of-truth filter).
router.get('/stats', authenticate, async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      where: revenueWhereClause(),
      select: { total: true, tax: true },
    });

    const totalRevenue = orders.reduce(
      (sum: number, o: { total: unknown }) => sum + Number(o.total),
      0
    );
    const totalTax = orders.reduce(
      (sum: number, o: { tax: unknown }) => sum + Number(o.tax),
      0
    );

    res.json({
      totalOrders: orders.length,
      totalRevenue,
      totalTax,
    });
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
        items: { include: { product: true } },
        promoCode: true,
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
    const { items, paymentMethod, discount = 0, promoCode } =
      createOrderSchema.parse(req.body);

    const settings = await prisma.storeSetting.findFirst();
    const taxRate = settings?.taxRate ? Number(settings.taxRate) : 0;

    const productIds = items.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, active: true },
    });

    if (products.length !== productIds.length) {
      return next(new AppError('Some products not found or inactive', 400));
    }

    let subtotal = 0;
    const orderItems = items.map((item) => {
      const product = products.find((p: { id: number }) => p.id === item.productId)!;
      const itemTotal = Number(product.price) * item.quantity;
      subtotal += itemTotal;
      return {
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      };
    });

    // Optional promo code validation + atomic usedCount increment (L4).
    // We prepare the where-clause for the updateMany call inside the transaction so
    // that two concurrent orders cannot both consume the last available use.
    let appliedPromo: { id: number; discountPercent: number; maxUses: number } | null = null;
    let discountAmount = discount;
    if (promoCode) {
      const promo = await prisma.promoCode.findUnique({ where: { code: promoCode } });
      if (!promo || !promo.isActive) {
        return next(new AppError('Invalid promo code', 400));
      }
      if (promo.expiresAt <= new Date()) {
        return next(new AppError('Promo code has expired', 400));
      }
      if (promo.usedCount >= promo.maxUses) {
        return next(new AppError('Promo code usage limit reached', 400));
      }
      appliedPromo = {
        id: promo.id,
        discountPercent: promo.discountPercent,
        maxUses: promo.maxUses,
      };
      discountAmount = subtotal * (promo.discountPercent / 100);
    }

    const tax = (subtotal - discountAmount) * (taxRate / 100);
    const total = subtotal + tax - discountAmount;

    const order = await prisma.$transaction(async (tx: any) => {
      // Oversell-safe inventory decrement: updateMany with gte guard.
      // If any line fails the guard, count will be < 1 and we roll back.
      for (const item of items) {
        const result = await tx.inventory.updateMany({
          where: { productId: item.productId, quantity: { gte: item.quantity } },
          data: { quantity: { decrement: item.quantity } },
        });
        if (result.count !== 1) {
          throw new AppError(
            `Insufficient stock for product ${item.productId}`,
            400
          );
        }
      }

      // If a promo was applied, atomically enforce caps + isActive + expiry while incrementing.
      // maxUses comes from the earlier fetch — Prisma can't reference sibling columns,
      // so we pass the literal cap into the guard. usedCount < maxUses.
      if (appliedPromo) {
        const promoUpdate = await tx.promoCode.updateMany({
          where: {
            id: appliedPromo.id,
            isActive: true,
            expiresAt: { gt: new Date() },
            usedCount: { lt: appliedPromo.maxUses },
          },
          data: { usedCount: { increment: 1 } },
        });
        if (promoUpdate.count !== 1) {
          throw new AppError('Promo code no longer usable', 400);
        }
      }

      const newOrder = await tx.order.create({
        data: {
          userId: req.user!.id,
          subtotal,
          tax,
          discount: discountAmount,
          total,
          paymentMethod,
          promoCodeId: appliedPromo?.id,
          items: { create: orderItems },
        },
        include: {
          items: { include: { product: true } },
          user: { select: { id: true, name: true } },
          promoCode: true,
        },
      });

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

// Void a completed order (L3): atomic stock restore + status flip + voidedAt stamp.
router.post('/:id/void', authenticate, voidOrderHandler);

export default router;
