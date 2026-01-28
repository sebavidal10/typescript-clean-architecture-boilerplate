import jwt from 'jsonwebtoken';
import { ITokenService } from '@domain/services/ITokenService';

/**
 * JWT Token Service Implementation
 * Handles JWT token generation and validation
 */
export class JWTTokenService implements ITokenService {
  private readonly secret: string;

  constructor() {
    this.secret = process.env['JWT_SECRET'] || 'dev-secret-change-this';

    if (this.secret === 'dev-secret-change-this' && process.env['NODE_ENV'] === 'production') {
      throw new Error('JWT_SECRET must be set in production environment');
    }
  }

  generate(userId: string): string {
    return jwt.sign({ userId }, this.secret, { expiresIn: '24h' });
  }

  verify(token: string): { userId: string } {
    try {
      const decoded = jwt.verify(token, this.secret) as { userId: string };
      return { userId: decoded.userId };
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Token has expired');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid token');
      }
      throw new Error('Token verification failed');
    }
  }
}
