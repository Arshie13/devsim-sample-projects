import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth.js';
import { createError } from '../middleware/errorHandler.js';

const router = Router();

// Validation schema
const categorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
});

// GET /api/categories - Get all categories
router.get('/', async (_req: Request, res: Response, next) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });

    res.json(categories);
  } catch (error) {
    next(error);
  }
});

// GET /api/categories/:id - Get category by ID
router.get('/:id', async (req: Request, res: Response, next) => {
  try {
    const category = await prisma.category.findUnique({
      where: { id: req.params.id },
      include: {
        products: {
          include: { category: true },
        },
      },
    });

    if (!category) {
      throw createError(404, 'Category not found');
    }

    res.json(category);
  } catch (error) {
    next(error);
  }
});

// POST /api/categories - Create category (Admin only)
router.post('/', authenticate, requireAdmin, async (req: AuthRequest, res: Response, next) => {
  try {
    const data = categorySchema.parse(req.body);

    // Check if category name already exists
    const existing = await prisma.category.findUnique({
      where: { name: data.name },
    });

    if (existing) {
      throw createError(400, 'Category with this name already exists');
    }

    const category = await prisma.category.create({
      data,
    });

    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
});

// PUT /api/categories/:id - Update category (Admin only)
router.put('/:id', authenticate, requireAdmin, async (req: AuthRequest, res: Response, next) => {
  try {
    const data = categorySchema.partial().parse(req.body);

    const existing = await prisma.category.findUnique({
      where: { id: req.params.id },
    });

    if (!existing) {
      throw createError(404, 'Category not found');
    }

    // Check if new name conflicts with another category
    if (data.name && data.name !== existing.name) {
      const nameConflict = await prisma.category.findUnique({
        where: { name: data.name },
      });

      if (nameConflict) {
        throw createError(400, 'Category with this name already exists');
      }
    }

    const category = await prisma.category.update({
      where: { id: req.params.id },
      data,
    });

    res.json(category);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/categories/:id - Delete category (Admin only)
router.delete('/:id', authenticate, requireAdmin, async (req: AuthRequest, res: Response, next) => {
  try {
    const existing = await prisma.category.findUnique({
      where: { id: req.params.id },
      include: { products: { take: 1 } },
    });

    if (!existing) {
      throw createError(404, 'Category not found');
    }

    if (existing.products.length > 0) {
      throw createError(400, 'Cannot delete category with products. Remove products first.');
    }

    await prisma.category.delete({
      where: { id: req.params.id },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
