import { Router } from 'express';
import bookRoutes from './book.routes.js';
import memberRoutes from './member.routes.js';
import borrowRoutes from './borrow.routes.js';

const router = Router();

router.use('/books', bookRoutes);
router.use('/members', memberRoutes);
router.use('/borrow-records', borrowRoutes);

export default router;
