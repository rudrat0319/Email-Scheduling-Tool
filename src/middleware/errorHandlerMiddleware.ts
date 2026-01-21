import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';
import { logger } from '../logger';

export class errorHandlerMiddleware{
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error({
    requestId: req.id,
    error: err.message,
    stack: err.stack,
  }, 'Request error');

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
    });
  }

  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
    },
  });
};
}