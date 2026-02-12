import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { createError } from '../middleware/errorHandler.js';

const router = Router();

// Validation schema
const reviewSchema = z.object({
  rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
  comment: z.string().min(10, 'Comment must be at least 10 characters'),
});

// GET /api/products/:productId/reviews - Get reviews for a product
router.get('/products/:productId/reviews', async (req: Request, res: Response, next) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { productId: req.params.productId },
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(reviews);
  } catch (error) {
    next(error);
  }
});

// POST /api/products/:productId/reviews - Create review
router.post('/products/:productId/reviews', authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    const data = reviewSchema.parse(req.body);
    const { productId } = req.params;

    // Verify product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw createError(404, 'Product not found');
    }

    // Check if user already reviewed this product
    const existingReview = await prisma.review.findFirst({
      where: {
        productId,
        userId: req.user!.id,
      },
    });

    if (existingReview) {
      throw createError(400, 'You have already reviewed this product');
    }

    const review = await prisma.review.create({
      data: {
        ...data,
        productId,
        userId: req.user!.id,
      },
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
    });

    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
});

// PUT /api/reviews/:id - Update review
router.put('/reviews/:id', authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    const data = reviewSchema.partial().parse(req.body);

    const existing = await prisma.review.findUnique({
      where: { id: req.params.id },
    });

    if (!existing) {
      throw createError(404, 'Review not found');
    }

    // Only allow owner to update
    if (existing.userId !== req.user!.id) {
      throw createError(403, 'Access denied');
    }

    const review = await prisma.review.update({
      where: { id: req.params.id },
      data,
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
    });

    res.json(review);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/reviews/:id - Delete review
router.delete('/reviews/:id', authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    const existing = await prisma.review.findUnique({
      where: { id: req.params.id },
    });

    if (!existing) {
      throw createError(404, 'Review not found');
    }

    // Allow owner or admin to delete
    if (existing.userId !== req.user!.id && req.user!.role !== 'ADMIN') {
      throw createError(403, 'Access denied');
    }

    await prisma.review.delete({
      where: { id: req.params.id },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
