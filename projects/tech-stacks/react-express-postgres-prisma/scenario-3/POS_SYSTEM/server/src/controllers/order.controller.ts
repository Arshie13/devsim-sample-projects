import type { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';

/**
 * Atomically void a completed order.
 *
 * Behavior (all inside a single prisma.$transaction):
 *   1. Flip Order.status to VOIDED only if currently COMPLETED.
 *   2. Stamp Order.voidedAt = new Date().
 *   3. For each OrderItem, increment the linked Inventory.quantity to restore stock.
 *   4. If the order was placed with a PromoCode, decrement that code's usedCount.
 *
 * Throws AppError if the order is missing or already voided.
 */
export async function voidOrder(orderId: number) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    if (order.status !== 'COMPLETED') {
      throw new AppError(
        `Cannot void order with status ${order.status} — only COMPLETED orders can be voided`,
        400
      );
    }

    // Restore inventory (stock) for each line item
    for (const item of order.items) {
      await tx.inventory.update({
        where: { productId: item.productId },
        data: { quantity: { increment: item.quantity } },
      });
    }

    // If a promo code was applied, decrement its usedCount atomically
    if (order.promoCodeId) {
      await tx.promoCode.update({
        where: { id: order.promoCodeId },
        data: { usedCount: { decrement: 1 } },
      });
    }

    const updated = await tx.order.update({
      where: { id: orderId },
      data: {
        status: 'VOIDED',
        voidedAt: new Date(),
      },
      include: {
        items: { include: { product: true } },
        user: { select: { id: true, name: true } },
      },
    });

    return updated;
  });
}

export async function voidOrderHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return next(new AppError('Invalid order id', 400));
    }
    const result = await voidOrder(id);
    res.json(result);
  } catch (error) {
    next(error);
  }
}
