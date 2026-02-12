import { Router } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

const productSchema = z.object({
  name: z.string().min(1),
  price: z.number().positive(),
  sku: z.string().min(1),
  categoryId: z.number().int().positive(),
  active: z.boolean().optional(),
});

// Get all products
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { search, categoryId, active } = req.query;

    const products = await prisma.product.findMany({
      where: {
        ...(search && {
          OR: [
            { name: { contains: String(search), mode: 'insensitive' } },
            { sku: { contains: String(search), mode: 'insensitive' } },
          ],
        }),
        ...(categoryId && { categoryId: Number(categoryId) }),
        ...(active !== undefined && { active: active === 'true' }),
      },
      include: {
        category: true,
        inventory: true,
      },
      orderBy: { name: 'asc' },
    });

    res.json(products);
  } catch (error) {
    next(error);
  }
});

// Get single product
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(req.params.id) },
      include: { category: true, inventory: true },
    });

    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
});

// Create product (Admin only)
router.post('/', authenticate, authorize('ADMIN'), async (req, res, next) => {
  try {
    const data = productSchema.parse(req.body);

    const product = await prisma.product.create({
      data: {
        ...data,
        price: data.price,
        inventory: {
          create: { quantity: 0, lowStock: 10 },
        },
      },
      include: { category: true, inventory: true },
    });

    res.status(201).json(product);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(error.issues[0].message, 400));
    }
    next(error);
  }
});

// Update product (Admin only)
router.put('/:id', authenticate, authorize('ADMIN'), async (req, res, next) => {
  try {
    const data = productSchema.partial().parse(req.body);

    const product = await prisma.product.update({
      where: { id: Number(req.params.id) },
      data,
      include: { category: true, inventory: true },
    });

    res.json(product);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(error.issues[0].message, 400));
    }
    next(error);
  }
});

// Deactivate product (Admin only)
router.patch('/:id/deactivate', authenticate, authorize('ADMIN'), async (req, res, next) => {
  try {
    const product = await prisma.product.update({
      where: { id: Number(req.params.id) },
      data: { active: false },
    });

    res.json(product);
  } catch (error) {
    next(error);
  }
});

export default router;
