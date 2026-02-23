import { Router } from 'express';
import {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  searchBooks,
} from '../controllers/book.controller.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { createBookSchema, updateBookSchema } from '../validators/book.validator.js';

const router = Router();

// GET /api/books/search?q=query
router.get('/search', searchBooks);

// GET /api/books
router.get('/', getAllBooks);

// GET /api/books/:id
router.get('/:id', getBookById);

// POST /api/books
router.post('/', validateRequest(createBookSchema), createBook);

// PUT /api/books/:id
router.put('/:id', validateRequest(updateBookSchema), updateBook);

// DELETE /api/books/:id
router.delete('/:id', deleteBook);

export default router;
