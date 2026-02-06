import { Router, Response } from 'express';
import prisma from '../lib/prisma.js';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/inventory - Get inventory status (Admin only)
router.get('/', authenticate, requireAdmin, async (_req: AuthRequest, res: Response, next) => {
  try {
    const products = await prisma.product.findMany({
      include: { category: true },
      orderBy: { stock: 'asc' },
    });

    // Calculate inventory stats
    const stats = {
      totalProducts: products.length,
      inStock: products.filter((p: { stock: number }) => p.stock > 5).length,
      lowStock: products.filter((p: { stock: number }) => p.stock > 0 && p.stock <= 5).length,
      outOfStock: products.filter((p: { stock: number }) => p.stock === 0).length,
      totalValue: products.reduce((sum: number, p: { price: number; stock: number }) => sum + p.price * p.stock, 0),
    };

    res.json({ products, stats });
  } catch (error) {
    next(error);
  }
});

// GET /api/inventory/low-stock - Get low stock products (Admin only)
router.get('/low-stock', authenticate, requireAdmin, async (_req: AuthRequest, res: Response, next) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        stock: { lte: 5 },
      },
      include: { category: true },
      orderBy: { stock: 'asc' },
    });

    res.json(products);
  } catch (error) {
    next(error);
  }
});

export default router;
