import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth.js';
import { createError } from '../middleware/errorHandler.js';

const router = Router();

// Validation schemas
const productSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().positive('Price must be positive'),
  image: z.string().url('Image must be a valid URL'),
  stock: z.number().int().min(0, 'Stock cannot be negative'),
  categoryId: z.string().uuid('Invalid category ID'),
});

const updateProductSchema = productSchema.partial();

// GET /api/products - Get all products
router.get('/', async (req: Request, res: Response, next) => {
  try {
    const { categoryId, search } = req.query;

    const where: Record<string, unknown> = {};

    if (categoryId) {
      where.categoryId = categoryId as string;
    }

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json(products);
  } catch (error) {
    next(error);
  }
});

// GET /api/products/:id - Get product by ID
router.get('/:id', async (req: Request, res: Response, next) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { category: true },
    });

    if (!product) {
      throw createError(404, 'Product not found');
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
});

// POST /api/products - Create product (Admin only)
router.post('/', authenticate, requireAdmin, async (req: AuthRequest, res: Response, next) => {
  try {
    const data = productSchema.parse(req.body);

    // Verify category exists
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });

    if (!category) {
      throw createError(404, 'Category not found');
    }

    const product = await prisma.product.create({
      data,
      include: { category: true },
    });

    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
});

// PUT /api/products/:id - Update product (Admin only)
router.put('/:id', authenticate, requireAdmin, async (req: AuthRequest, res: Response, next) => {
  try {
    const data = updateProductSchema.parse(req.body);

    // Check if product exists
    const existing = await prisma.product.findUnique({
      where: { id: req.params.id },
    });

    if (!existing) {
      throw createError(404, 'Product not found');
    }

    // If categoryId is being updated, verify it exists
    if (data.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: data.categoryId },
      });

      if (!category) {
        throw createError(404, 'Category not found');
      }
    }

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data,
      include: { category: true },
    });

    res.json(product);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/products/:id - Delete product (Admin only)
router.delete('/:id', authenticate, requireAdmin, async (req: AuthRequest, res: Response, next) => {
  try {
    const existing = await prisma.product.findUnique({
      where: { id: req.params.id },
    });

    if (!existing) {
      throw createError(404, 'Product not found');
    }

    await prisma.product.delete({
      where: { id: req.params.id },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
