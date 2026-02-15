import { Router } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

const settingsSchema = z.object({
  name: z.string().min(1),
  address: z.string().optional(),
  taxRate: z.number().min(0).max(100),
  cashEnabled: z.boolean(),
  cardEnabled: z.boolean(),
});

// Get store settings
router.get('/', authenticate, async (req, res, next) => {
  try {
    let settings = await prisma.storeSetting.findFirst();

    // Create default settings if none exist
    if (!settings) {
      settings = await prisma.storeSetting.create({
        data: {
          name: 'My Store',
          address: '',
          taxRate: 0,
          cashEnabled: true,
          cardEnabled: true,
        },
      });
    }

    res.json(settings);
  } catch (error) {
    next(error);
  }
});

// Update store settings (Admin only)
router.put('/', authenticate, authorize('ADMIN'), async (req, res, next) => {
  try {
    const data = settingsSchema.parse(req.body);

    let settings = await prisma.storeSetting.findFirst();

    if (settings) {
      settings = await prisma.storeSetting.update({
        where: { id: settings.id },
        data,
      });
    } else {
      settings = await prisma.storeSetting.create({ data });
    }

    res.json(settings);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(error.issues[0].message, 400));
    }
    next(error);
  }
});

export default router;
