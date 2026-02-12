import type { Request, Response } from 'express';
import { prisma } from '../utils/prisma.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';
import type { ApiResponse, BookCreateInput, BookUpdateInput } from '../types/index.js';

/**
 * @route   GET /api/books
 * @desc    Get all books
 * @access  Public
 */
export const getAllBooks = asyncHandler(async (_req: Request, res: Response) => {
  const books = await prisma.book.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const response: ApiResponse = {
    success: true,
    data: books,
  };

  res.json(response);
});

/**
 * @route   GET /api/books/:id
 * @desc    Get single book by ID
 * @access  Public
 */
export const getBookById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || typeof id !== 'string') {
    throw new AppError('Invalid book ID', 400);
  }

  const book = await prisma.book.findUnique({
    where: { id },
  });

  if (!book) {
    throw new AppError('Book not found', 404);
  }

  const response: ApiResponse = {
    success: true,
    data: book,
  };

  res.json(response);
});

/**
 * @route   POST /api/books
 * @desc    Create a new book
 * @access  Private
 */
export const createBook = asyncHandler(async (req: Request, res: Response) => {
  const bookData: BookCreateInput = req.body;

  // Check if ISBN already exists
  const existingBook = await prisma.book.findUnique({
    where: { isbn: bookData.isbn },
  });

  if (existingBook) {
    throw new AppError('Book with this ISBN already exists', 400);
  }

  const book = await prisma.book.create({
    data: bookData,
  });

  const response: ApiResponse = {
    success: true,
    data: book,
    message: 'Book created successfully',
  };

  res.status(201).json(response);
});

/**
 * @route   PUT /api/books/:id
 * @desc    Update a book
 * @access  Private
 */
export const updateBook = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData: BookUpdateInput = req.body;

  if (!id || typeof id !== 'string') {
    throw new AppError('Invalid book ID', 400);
  }

  const existingBook = await prisma.book.findUnique({
    where: { id },
  });

  if (!existingBook) {
    throw new AppError('Book not found', 404);
  }

  // If ISBN is being updated, check it's not already taken
  if (updateData.isbn && updateData.isbn !== existingBook.isbn) {
    const isbnTaken = await prisma.book.findUnique({
      where: { isbn: updateData.isbn },
    });

    if (isbnTaken) {
      throw new AppError('ISBN already exists', 400);
    }
  }

  const book = await prisma.book.update({
    where: { id },
    data: updateData,
  });

  const response: ApiResponse = {
    success: true,
    data: book,
    message: 'Book updated successfully',
  };

  res.json(response);
});

/**
 * @route   DELETE /api/books/:id
 * @desc    Delete a book (soft delete - archive)
 * @access  Private
 */
export const deleteBook = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || typeof id !== 'string') {
    throw new AppError('Invalid book ID', 400);
  }

  const book = await prisma.book.findUnique({
    where: { id },
    include: {
      borrowRecords: {
        where: {
          status: { in: ['BORROWED', 'OVERDUE'] },
        },
      },
    },
  });

  if (!book) {
    throw new AppError('Book not found', 404);
  }

  // Check if book has active borrow records
  if (book.borrowRecords.length > 0) {
    throw new AppError('Cannot delete book with active borrow records', 400);
  }

  await prisma.book.delete({
    where: { id },
  });

  const response: ApiResponse = {
    success: true,
    message: 'Book deleted successfully',
  };

  res.json(response);
});

/**
 * @route   GET /api/books/search?q=query
 * @desc    Search books by title, author, or ISBN
 * @access  Public
 */
export const searchBooks = asyncHandler(async (req: Request, res: Response) => {
  const { q } = req.query;

  if (!q || typeof q !== 'string') {
    throw new AppError('Search query is required', 400);
  }

  const books = await prisma.book.findMany({
    where: {
      OR: [
        { title: { contains: q, mode: 'insensitive' } },
        { author: { contains: q, mode: 'insensitive' } },
        { isbn: { contains: q, mode: 'insensitive' } },
      ],
    },
    orderBy: { createdAt: 'desc' },
  });

  const response: ApiResponse = {
    success: true,
    data: books,
  };

  res.json(response);
});
