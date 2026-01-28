import { Request, Response, NextFunction } from 'express';
import {
  DomainException,
  ValidationException,
  EntityNotFoundException,
  DuplicateEntityException,
} from '@domain/exceptions/DomainException';
import { Logger } from '@shared/Logger';

/**
 * Global error handler middleware
 * Converts domain exceptions to appropriate HTTP responses
 */
export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  Logger.error('Error occurred:', error);

  // Handle domain-specific exceptions
  if (error instanceof ValidationException) {
    res.status(400).json({
      success: false,
      error: {
        type: 'ValidationError',
        message: error.message,
      },
    });
    return;
  }

  if (error instanceof EntityNotFoundException) {
    res.status(404).json({
      success: false,
      error: {
        type: 'NotFoundError',
        message: error.message,
      },
    });
    return;
  }

  if (error instanceof DuplicateEntityException) {
    res.status(409).json({
      success: false,
      error: {
        type: 'ConflictError',
        message: error.message,
      },
    });
    return;
  }

  if (error instanceof DomainException) {
    res.status(400).json({
      success: false,
      error: {
        type: 'DomainError',
        message: error.message,
      },
    });
    return;
  }

  // Handle unexpected errors
  res.status(500).json({
    success: false,
    error: {
      type: 'InternalServerError',
      message:
        process.env['NODE_ENV'] === 'production' ? 'An unexpected error occurred' : error.message,
    },
  });
};
