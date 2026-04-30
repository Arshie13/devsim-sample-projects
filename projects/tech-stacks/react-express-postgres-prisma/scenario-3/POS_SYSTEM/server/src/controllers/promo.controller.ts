import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';

const validateSchema = z.object({
  code: z.string().min(1),
  subtotal: z.number().nonnegative(),
});

export type PromoValidationResult =
  | {
      ok: true;
      promo: { id: number; code: string; discountPercent: number; maxUses: number };
      discountPercent: number;
      finalTotal: number;
    }
  | { ok: false; reason: 'NOT_FOUND' | 'INACTIVE' | 'EXPIRED' | 'EXHAUSTED' };

/**
 * Pure(ish) validation helper — does a DB lookup but does NOT mutate state.
 * Returns a discriminated union so callers can distinguish failure reasons.
 */
export async function validatePromo(
  code: string,
  subtotal: number
): Promise<PromoValidationResult> {
  const promo = await prisma.promoCode.findUnique({ where: { code } });
  if (!promo) return { ok: false, reason: 'NOT_FOUND' };
  if (!promo.isActive) return { ok: false, reason: 'INACTIVE' };
  if (promo.expiresAt <= new Date()) return { ok: false, reason: 'EXPIRED' };
  if (promo.usedCount >= promo.maxUses) return { ok: false, reason: 'EXHAUSTED' };

  const finalTotal = subtotal * (1 - promo.discountPercent / 100);
  return {
    ok: true,
    promo: {
      id: promo.id,
      code: promo.code,
      discountPercent: promo.discountPercent,
      maxUses: promo.maxUses,
    },
    discountPercent: promo.discountPercent,
    finalTotal,
  };
}

export async function validatePromoHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { code, subtotal } = validateSchema.parse(req.body);
    const result = await validatePromo(code, subtotal);

    if (!result.ok) {
      const messages: Record<typeof result.reason, string> = {
        NOT_FOUND: 'Promo code not found',
        INACTIVE: 'Promo code is inactive',
        EXPIRED: 'Promo code has expired',
        EXHAUSTED: 'Promo code usage limit reached',
      };
      return res.status(400).json({
        success: false,
        reason: result.reason,
        message: messages[result.reason],
      });
    }

    res.json({
      success: true,
      data: {
        discountPercent: result.discountPercent,
        finalTotal: result.finalTotal,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(error.issues[0].message, 400));
    }
    next(error);
  }
}

export async function listPromosHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const promos = await prisma.promoCode.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        code: true,
        discountPercent: true,
        maxUses: true,
        usedCount: true,
        expiresAt: true,
        isActive: true,
        createdAt: true,
      },
    });
    res.json(
      promos.map((p: { maxUses: number; usedCount: number }) => ({
        ...p,
        remainingUses: p.maxUses - p.usedCount,
      }))
    );
  } catch (error) {
    next(error);
  }
}
