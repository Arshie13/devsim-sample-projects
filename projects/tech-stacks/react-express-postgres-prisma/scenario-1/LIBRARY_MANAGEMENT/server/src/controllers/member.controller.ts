import type { Request, Response } from 'express';
import { prisma } from '../utils/prisma.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';
import type { ApiResponse, MemberCreateInput, MemberUpdateInput } from '../types/index.js';

/**
 * @route   GET /api/members
 * @desc    Get all members
 * @access  Private
 */
export const getAllMembers = asyncHandler(async (_req: Request, res: Response) => {
  const members = await prisma.member.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const response: ApiResponse = {
    success: true,
    data: members,
  };

  res.json(response);
});

/**
 * @route   GET /api/members/:id
 * @desc    Get single member by ID
 * @access  Private
 */
export const getMemberById = asyncHandler(async (req: Request, res: Response) => {
  const id = typeof req.params.id === 'string' ? req.params.id : req.params.id?.[0];
  if (!id) throw new AppError('Invalid member ID', 400);

  const member = await prisma.member.findUnique({
    where: { id },
    include: {
      borrowRecords: {
        include: {
          book: true,
        },
        orderBy: { borrowedAt: 'desc' },
      },
    },
  });

  if (!member) {
    throw new AppError('Member not found', 404);
  }

  const response: ApiResponse = {
    success: true,
    data: member,
  };

  res.json(response);
});

/**
 * @route   POST /api/members
 * @desc    Create a new member
 * @access  Private
 */
export const createMember = asyncHandler(async (req: Request, res: Response) => {
  const memberData: MemberCreateInput = req.body;

  // Check if email already exists
  const existingMember = await prisma.member.findUnique({
    where: { email: memberData.email },
  });

  if (existingMember) {
    throw new AppError('Member with this email already exists', 400);
  }

  const member = await prisma.member.create({
    data: memberData,
  });

  const response: ApiResponse = {
    success: true,
    data: member,
    message: 'Member created successfully',
  };

  res.status(201).json(response);
});

/**
 * @route   PUT /api/members/:id
 * @desc    Update a member
 * @access  Private
 */
export const updateMember = asyncHandler(async (req: Request, res: Response) => {
  const id = typeof req.params.id === 'string' ? req.params.id : req.params.id?.[0];
  if (!id) throw new AppError('Invalid member ID', 400);
  const updateData: MemberUpdateInput = req.body;

  const existingMember = await prisma.member.findUnique({
    where: { id },
  });

  if (!existingMember) {
    throw new AppError('Member not found', 404);
  }

  // If email is being updated, check it's not already taken
  if (updateData.email && updateData.email !== existingMember.email) {
    const emailTaken = await prisma.member.findUnique({
      where: { email: updateData.email },
    });

    if (emailTaken) {
      throw new AppError('Email already exists', 400);
    }
  }

  const member = await prisma.member.update({
    where: { id: id },
    data: updateData,
  });

  const response: ApiResponse = {
    success: true,
    data: member,
    message: 'Member updated successfully',
  };

  res.json(response);
});

/**
 * @route   DELETE /api/members/:id
 * @desc    Delete a member
 * @access  Private
 */
export const deleteMember = asyncHandler(async (req: Request, res: Response) => {
  const id = typeof req.params.id === 'string' ? req.params.id : req.params.id?.[0];
  if (!id) throw new AppError('Invalid member ID', 400);

  const member = await prisma.member.findUnique({
    where: { id },
    include: {
      borrowRecords: {
        where: {
          status: { in: ['BORROWED', 'OVERDUE'] },
        },
      },
    },
  });

  if (!member) {
    throw new AppError('Member not found', 404);
  }

  // Check if member has active borrow records
  if (member.borrowRecords.length > 0) {
    throw new AppError('Cannot delete member with active borrow records', 400);
  }

  await prisma.member.delete({
    where: { id: id },
  });

  const response: ApiResponse = {
    success: true,
    message: 'Member deleted successfully',
  };

  res.json(response);
});
