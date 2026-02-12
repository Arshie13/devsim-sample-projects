import { Router, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth.js';
import { createError } from '../middleware/errorHandler.js';

const router = Router();

// Validation schemas
const orderItemSchema = z.object({
  productId: z.string().uuid('Invalid product ID'),
  quantity: z.number().int().positive('Quantity must be positive'),
});

const createOrderSchema = z.object({
  address: z.string().min(10, 'Address must be at least 10 characters'),
  items: z.array(orderItemSchema).min(1, 'Order must have at least one item'),
});

const updateStatusSchema = z.object({
  status: z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
});

// GET /api/orders - Get all orders (Admin only)
router.get('/', authenticate, requireAdmin, async (_req: AuthRequest, res: Response, next) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        items: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(orders);
  } catch (error) {
    next(error);
  }
});

// GET /api/orders/my - Get current user's orders
router.get('/my', authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user!.id },
      include: {
        items: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(orders);
  } catch (error) {
    next(error);
  }
});

// GET /api/orders/:id - Get order by ID
router.get('/:id', authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        items: {
          include: { product: true },
        },
      },
    });

    if (!order) {
      throw createError(404, 'Order not found');
    }

    // Only allow access if user owns the order or is admin
    if (order.userId !== req.user!.id && req.user!.role !== 'ADMIN') {
      throw createError(403, 'Access denied');
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
});

// POST /api/orders - Create order
router.post('/', authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    const data = createOrderSchema.parse(req.body);

    // Get all products and verify stock
    const productIds = data.items.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    // Define product type for the map
    type ProductData = { id: string; name: string; price: number; stock: number };
    
    // Create a map for quick lookup
    const productMap = new Map<string, ProductData>(
      products.map((p) => [p.id, p as ProductData])
    );

    // Validate all products exist and have sufficient stock
    let total = 0;
    for (const item of data.items) {
      const product = productMap.get(item.productId);
      
      if (!product) {
        throw createError(404, `Product not found: ${item.productId}`);
      }

      if (product.stock < item.quantity) {
        throw createError(400, `Insufficient stock for ${product.name}. Available: ${product.stock}`);
      }

      total += product.price * item.quantity;
    }

    // Create order with items in a transaction
    const order = await prisma.$transaction(async (tx: typeof prisma) => {
      // Create the order
      const newOrder = await tx.order.create({
        data: {
          userId: req.user!.id,
          address: data.address,
          total,
          status: 'PENDING',
          items: {
            create: data.items.map((item) => {
              const product = productMap.get(item.productId)!;
              return {
                productId: item.productId,
                quantity: item.quantity,
                price: product.price,
              };
            }),
          },
        },
        include: {
          items: {
            include: { product: true },
          },
        },
      });

      // Update stock for each product
      for (const item of data.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return newOrder;
    });

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/orders/:id/status - Update order status (Admin only)
router.patch('/:id/status', authenticate, requireAdmin, async (req: AuthRequest, res: Response, next) => {
  try {
    const { status } = updateStatusSchema.parse(req.body);

    const existing = await prisma.order.findUnique({
      where: { id: req.params.id },
    });

    if (!existing) {
      throw createError(404, 'Order not found');
    }

    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        items: {
          include: { product: true },
        },
      },
    });

    res.json(order);
  } catch (error) {
    next(error);
  }
});

export default router;
