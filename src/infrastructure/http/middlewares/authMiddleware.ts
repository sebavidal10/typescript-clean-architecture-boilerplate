import { Request, Response, NextFunction } from 'express';
import { container } from '../../../infrastructure/di/container';
import { ITokenService } from '@domain/services/ITokenService';

/**
 * Extended Express Request with userId
 */
export interface AuthRequest extends Request {
  userId?: string;
}

/**
 * Authentication Middleware
 * Validates JWT token and adds userId to request
 */
export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      res.status(401).json({
        success: false,
        error: {
          type: 'UnauthorizedError',
          message: 'No authorization header provided',
        },
      });
      return;
    }

    // Check Bearer format
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      res.status(401).json({
        success: false,
        error: {
          type: 'UnauthorizedError',
          message: 'Invalid authorization header format. Expected: Bearer <token>',
        },
      });
      return;
    }

    const token = parts[1]!; // Safe because we checked length === 2

    // Verify token
    const tokenService = container.resolve<ITokenService>('ITokenService');
    const { userId } = tokenService.verify(token);

    // Add userId to request
    req.userId = userId;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: {
        type: 'UnauthorizedError',
        message: error instanceof Error ? error.message : 'Invalid or expired token',
      },
    });
  }
};
