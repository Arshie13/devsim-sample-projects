import { Router } from 'express';
import {
  borrowBookMember,
  borrowBookWalkIn,
  returnBook,
} from '../controllers/borrow.controller.js';
import { validateRequest } from '../middleware/validateRequest.js';
import {
  borrowBookMemberSchema,
  borrowBookWalkInSchema,
} from '../validators/borrow.validator.js';

const router = Router();

// POST /api/borrow-records/member
router.post('/member', validateRequest(borrowBookMemberSchema), borrowBookMember);

// POST /api/borrow-records/walk-in
router.post('/walk-in', validateRequest(borrowBookWalkInSchema), borrowBookWalkIn);

// PUT /api/borrow-records/:id/return
router.put('/:id/return', returnBook);

export default router;
