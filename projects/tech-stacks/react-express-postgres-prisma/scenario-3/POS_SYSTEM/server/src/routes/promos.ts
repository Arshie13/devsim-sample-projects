import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import {
  validatePromoHandler,
  listPromosHandler,
} from '../controllers/promo.controller';

const router = Router();

// POST /api/promos/validate — cashier-callable, checks a code against a subtotal.
router.post('/validate', authenticate, validatePromoHandler);

// GET /api/promos — admin-only, returns all promos with usage stats (usedCount, maxUses, remainingUses).
router.get('/', authenticate, authorize('ADMIN'), listPromosHandler);

export default router;
