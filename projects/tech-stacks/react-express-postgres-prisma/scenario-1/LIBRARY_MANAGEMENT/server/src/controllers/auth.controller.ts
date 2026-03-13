import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';
import type { ApiResponse } from '../types/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'library-secret-key-change-in-production';
const JWT_EXPIRES_IN = '24h';

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('Email and password are required', 400);
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError('Invalid credentials', 401);
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  const response: ApiResponse = {
    success: true,
    data: {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    },
    message: 'Login successful',
  };

  res.json(response);
});

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
export const logout = asyncHandler(async (_req: Request, res: Response) => {
  const response: ApiResponse = {
    success: true,
    message: 'Logout successful',
  };

  res.json(response);
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current user
 * @access  Private
 */
export const getMe = asyncHandler(async (req: Request, res: Response) => {
  // User is attached by auth middleware
  const user = (req as any).user;

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!dbUser) {
    throw new AppError('User not found', 404);
  }

  const response: ApiResponse = {
    success: true,
    data: dbUser,
  };

  res.json(response);
});
