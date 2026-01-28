import { Request, Response, NextFunction } from 'express';
import { RegisterUserUseCase } from '@application/use-cases/RegisterUserUseCase';
import { LoginUseCase } from '@application/use-cases/LoginUseCase';
import { container } from '../../di/container';

/**
 * Authentication Controller
 * Handles auth-related HTTP requests
 */
export class AuthController {
  /**
   * Register a new user
   * POST /api/auth/register
   */
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, name, password } = req.body as {
        email: string;
        name: string;
        password: string;
      };

      // Validate required fields
      if (!email || !name || !password) {
        res.status(400).json({
          success: false,
          error: {
            type: 'ValidationError',
            message: 'Email, name, and password are required',
          },
        });
        return;
      }

      const useCase = container.resolve(RegisterUserUseCase);
      const result = await useCase.execute({ email, name, password });

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Login user
   * POST /api/auth/login
   */
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body as { email: string; password: string };

      // Validate required fields
      if (!email || !password) {
        res.status(400).json({
          success: false,
          error: {
            type: 'ValidationError',
            message: 'Email and password are required',
          },
        });
        return;
      }

      const useCase = container.resolve(LoginUseCase);
      const result = await useCase.execute({ email, password });

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
