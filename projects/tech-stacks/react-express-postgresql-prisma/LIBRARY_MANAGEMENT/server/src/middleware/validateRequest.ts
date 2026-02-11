import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema } from 'zod';
import type { ApiResponse } from '../types/index.js';

export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: unknown) {
      const zodError = error as { issues?: Array<{ path: PropertyKey[]; message: string }> };
      if (zodError.issues) {
        const response: ApiResponse = {
          success: false,
          error: 'Validation error',
          message: zodError.issues.map(e => 
            `${e.path.filter((p): p is string | number => typeof p === 'string' || typeof p === 'number').join('.')}: ${e.message}`
          ).join(', '),
        };
        return res.status(400).json(response) as unknown as void;
      }
      next(error);
    }
  };
};
