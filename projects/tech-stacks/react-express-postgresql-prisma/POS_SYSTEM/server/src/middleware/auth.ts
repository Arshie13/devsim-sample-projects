import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('No token provided', 401));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
      email: string;
      role: string;
    };
    req.user = decoded;
    next();
  } catch (error) {
    return next(new AppError('Invalid token', 401));
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('Not authorized', 403));
    }
    next();
  };
};
