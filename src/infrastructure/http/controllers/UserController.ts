import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { CreateUserUseCase } from '@application/use-cases/CreateUserUseCase';
import { GetUserUseCase } from '@application/use-cases/GetUserUseCase';
import { GetCurrentUserUseCase } from '@application/use-cases/GetCurrentUserUseCase';
import { AuthRequest } from '../middlewares/authMiddleware';

/**
 * UserController
 * Handles HTTP requests for user endpoints
 * Delegates business logic to use cases
 */
export class UserController {
  /**
   * POST /users - Create a new user
   */
  async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const createUserUseCase = container.resolve(CreateUserUseCase);
      const { email, name } = req.body as { email: string; name: string };

      const user = await createUserUseCase.execute({ email, name });

      res.status(201).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const getUserUseCase = container.resolve(GetUserUseCase);
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          error: {
            type: 'ValidationError',
            message: 'User ID is required',
          },
        });
        return;
      }

      const user = await getUserUseCase.execute(id);

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /users/me - Get current authenticated user
   */
  async getCurrentUser(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const getCurrentUserUseCase = container.resolve(GetCurrentUserUseCase);

      if (!req.userId) {
        res.status(401).json({
          success: false,
          error: {
            type: 'UnauthorizedError',
            message: 'User not authenticated',
          },
        });
        return;
      }

      const user = await getCurrentUserUseCase.execute(req.userId);

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
}
