import type { Request, Response } from 'express';
import { prisma } from '../utils/prisma.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';
import type { ApiResponse, BorrowBookMemberInput, BorrowBookWalkInInput } from '../types/index.js';

/**
 * @route   GET /api/borrow-records
 * @desc    Get all borrow records
 * @access  Private
 */
export const getAllBorrowRecords = asyncHandler(async (_req: Request, res: Response) => {
  const records = await prisma.borrowRecord.findMany({
    include: {
      book: true,
      member: true,
      walkInBorrower: true,
    },
    orderBy: { borrowedAt: 'desc' },
  });

  const response: ApiResponse = {
    success: true,
    data: records,
  };

  res.json(response);
});

/**
 * @route   GET /api/borrow-records/:id
 * @desc    Get single borrow record by ID
 * @access  Private
 */
export const getBorrowRecordById = asyncHandler(async (req: Request, res: Response) => {
  const id = typeof req.params.id === 'string' ? req.params.id : req.params.id?.[0];
  if (!id) throw new AppError('Invalid record ID', 400);

  const record = await prisma.borrowRecord.findUnique({
    where: { id },
    include: {
      book: true,
      member: true,
      walkInBorrower: true,
    },
  });

  if (!record) {
    throw new AppError('Borrow record not found', 404);
  }

  const response: ApiResponse = {
    success: true,
    data: record,
  };

  res.json(response);
});

/**
 * @route   POST /api/borrow-records/member
 * @desc    Borrow a book for a registered member
 * @access  Private
 */
export const borrowBookMember = asyncHandler(async (req: Request, res: Response) => {
  const { bookId, memberId, dueDate }: BorrowBookMemberInput = req.body;

  // Check if book exists and has available copies
  const book = await prisma.book.findUnique({
    where: { id: bookId },
  });

  if (!book) {
    throw new AppError('Book not found', 404);
  }

  if (book.availableCopies <= 0) {
    throw new AppError('No available copies of this book', 400);
  }

  // Check if member exists
  const member = await prisma.member.findUnique({
    where: { id: memberId },
  });

  if (!member) {
    throw new AppError('Member not found', 404);
  }

  // Create borrow record and update book availability in a transaction
  const result = await prisma.$transaction(async (tx) => {
    const record = await tx.borrowRecord.create({
      data: {
        bookId,
        memberId,
        borrowerType: 'MEMBER',
        dueDate: new Date(dueDate),
        status: 'BORROWED',
      },
      include: {
        book: true,
        member: true,
      },
    });

    await tx.book.update({
      where: { id: bookId },
      data: {
        availableCopies: {
          decrement: 1,
        },
      },
    });

    return record;
  });

  const response: ApiResponse = {
    success: true,
    data: result,
    message: 'Book borrowed successfully',
  };

  res.status(201).json(response);
});

/**
 * @route   POST /api/borrow-records/walk-in
 * @desc    Borrow a book for a walk-in borrower
 * @access  Private
 */
export const borrowBookWalkIn = asyncHandler(async (req: Request, res: Response) => {
  const { bookId, walkInBorrower, dueDate }: BorrowBookWalkInInput = req.body;

  // Check if book exists and has available copies
  const book = await prisma.book.findUnique({
    where: { id: bookId },
  });

  if (!book) {
    throw new AppError('Book not found', 404);
  }

  if (book.availableCopies <= 0) {
    throw new AppError('No available copies of this book', 400);
  }

  // Create walk-in borrower, borrow record, and update book in a transaction
  const result = await prisma.$transaction(async (tx) => {
    const newWalkInBorrower = await tx.walkInBorrower.create({
      data: walkInBorrower,
    });

    const record = await tx.borrowRecord.create({
      data: {
        bookId,
        walkInBorrowerId: newWalkInBorrower.id,
        borrowerType: 'WALK_IN',
        dueDate: new Date(dueDate),
        status: 'BORROWED',
      },
      include: {
        book: true,
        walkInBorrower: true,
      },
    });

    await tx.book.update({
      where: { id: bookId },
      data: {
        availableCopies: {
          decrement: 1,
        },
      },
    });

    return { record, walkInBorrower: newWalkInBorrower };
  });

  const response: ApiResponse = {
    success: true,
    data: result,
    message: 'Book borrowed successfully',
  };

  res.status(201).json(response);
});

/**
 * @route   PUT /api/borrow-records/:id/return
 * @desc    Return a borrowed book
 * @access  Private
 */
export const returnBook = asyncHandler(async (req: Request, res: Response) => {
  const id = typeof req.params.id === 'string' ? req.params.id : req.params.id?.[0];
  if (!id) throw new AppError('Invalid record ID', 400);

  const record = await prisma.borrowRecord.findUnique({
    where: { id },
    include: { book: true },
  });

  if (!record) {
    throw new AppError('Borrow record not found', 404);
  }

  if (record.status === 'RETURNED') {
    throw new AppError('Book already returned', 400);
  }

  // Update record and increment available copies in a transaction
  const result = await prisma.$transaction(async (tx) => {
    const updatedRecord = await tx.borrowRecord.update({
      where: { id },
      data: {
        returnedAt: new Date(),
        status: 'RETURNED',
      },
      include: {
        book: true,
        member: true,
        walkInBorrower: true,
      },
    });

    await tx.book.update({
      where: { id: record.bookId },
      data: {
        availableCopies: {
          increment: 1,
        },
      },
    });

    return updatedRecord;
  });

  const response: ApiResponse = {
    success: true,
    data: result,
    message: 'Book returned successfully',
  };

  res.json(response);
});

/**
 * @route   GET /api/borrow-records/overdue
 * @desc    Get all overdue borrow records
 * @access  Private
 */
export const getOverdueRecords = asyncHandler(async (_req: Request, res: Response) => {
  const records = await prisma.borrowRecord.findMany({
    where: {
      status: { in: ['BORROWED', 'OVERDUE'] },
      dueDate: {
        lt: new Date(),
      },
    },
    include: {
      book: true,
      member: true,
      walkInBorrower: true,
    },
    orderBy: { dueDate: 'asc' },
  });

  // Update status to OVERDUE for records that are past due
  const recordIds = records.map((r: { id: string }) => r.id);
  if (recordIds.length > 0) {
    await prisma.borrowRecord.updateMany({
      where: {
        id: { in: recordIds },
        status: 'BORROWED',
      },
      data: {
        status: 'OVERDUE',
      },
    });
  }

  const response: ApiResponse = {
    success: true,
    data: records,
  };

  res.json(response);
});
