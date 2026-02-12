import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  role: z.enum(['ADMIN', 'CASHIER']).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Register
router.post('/register', async (req, res, next) => {
  try {
    const { email, password, name, role } = registerSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return next(new AppError('Email already registered', 400));
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role || 'CASHIER',
      },
      select: { id: true, email: true, name: true, role: true },
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as SignOptions
    );

    res.status(201).json({ user, token });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(error.issues[0].message, 400));
    }
    next(error);
  }
});

// Login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return next(new AppError('Invalid credentials', 401));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new AppError('Invalid credentials', 401));
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as SignOptions
    );

    res.json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      token,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(error.issues[0].message, 400));
    }
    next(error);
  }
});

// Get current user
router.get('/me', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { id: true, email: true, name: true, role: true },
    });
    res.json(user);
  } catch (error) {
    next(error);
  }
});

export default router;
