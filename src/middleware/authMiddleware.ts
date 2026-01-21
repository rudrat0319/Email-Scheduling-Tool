import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { UnauthorizedError } from '../errors';

declare global {
  namespace Express {
    interface Request {
      user?: { userId: string };
      id?: string;
    }
  }
}

export const createAuthMiddleware = (authService: AuthService) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedError('Missing or invalid authorization header');
      }

      const token = authHeader.substring(7);
      const payload = authService.verifyToken(token);
      req.user = { userId: payload.userId };
      next();
    } catch (error) {
      next(error);
    }
  };
};