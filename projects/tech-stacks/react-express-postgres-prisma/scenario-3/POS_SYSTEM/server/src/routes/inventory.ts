import { Router } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

const adjustStockSchema = z.object({
  adjustment: z.number().int(),
  reason: z.string().optional(),
});

// Get all inventory
router.get('/', authenticate, async (req, res, next) => {
  try {
    const inventory = await prisma.inventory.findMany({
      include: {
        product: {
          select: { id: true, name: true, sku: true, active: true },
        },
      },
      orderBy: { product: { name: 'asc' } },
    });

    res.json(inventory);
  } catch (error) {
    next(error);
  }
});

// Get low stock items
router.get('/low-stock', authenticate, async (req, res, next) => {
  try {
    const lowStockItems = await prisma.inventory.findMany({
      where: {
        quantity: { lte: prisma.inventory.fields.lowStock },
      },
      include: {
        product: {
          select: { id: true, name: true, sku: true, active: true },
        },
      },
      orderBy: { quantity: 'asc' },
    });

    // Filter using raw SQL since Prisma doesn't support field comparisons directly
    const allInventory = await prisma.inventory.findMany({
      include: {
        product: {
          select: { id: true, name: true, sku: true, active: true },
        },
      },
    });

    const filtered = allInventory.filter((inv) => inv.quantity <= inv.lowStock);

    res.json(filtered);
  } catch (error) {
    next(error);
  }
});

// Adjust stock (Admin only)
router.patch('/:productId/adjust', authenticate, authorize('ADMIN'), async (req, res, next) => {
  try {
    const { adjustment } = adjustStockSchema.parse(req.body);
    const productId = Number(req.params.productId);

    const inventory = await prisma.inventory.findUnique({
      where: { productId },
    });

    if (!inventory) {
      return next(new AppError('Inventory record not found', 404));
    }

    const newQuantity = inventory.quantity + adjustment;
    if (newQuantity < 0) {
      return next(new AppError('Cannot reduce stock below zero', 400));
    }

    const updated = await prisma.inventory.update({
      where: { productId },
      data: { quantity: newQuantity },
      include: { product: true },
    });

    res.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(error.issues[0].message, 400));
    }
    next(error);
  }
});

// Set stock quantity (Admin only)
router.put('/:productId', authenticate, authorize('ADMIN'), async (req, res, next) => {
  try {
    const { quantity, lowStock } = z
      .object({
        quantity: z.number().int().min(0),
        lowStock: z.number().int().min(0).optional(),
      })
      .parse(req.body);

    const productId = Number(req.params.productId);

    const updated = await prisma.inventory.update({
      where: { productId },
      data: {
        quantity,
        ...(lowStock !== undefined && { lowStock }),
      },
      include: { product: true },
    });

    res.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(error.issues[0].message, 400));
    }
    next(error);
  }
});

export default router;
