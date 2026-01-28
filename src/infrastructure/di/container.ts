import 'reflect-metadata';
import { container } from 'tsyringe';
import { IUserRepository } from '@domain/repositories/IUserRepository';
import { ITokenService } from '@domain/services/ITokenService';
import { InMemoryUserRepository } from '../repositories/InMemoryUserRepository';
import { JWTTokenService } from '../services/JWTTokenService';
// import { TypeORMUserRepository } from '../repositories/TypeORMUserRepository';
// import { DataSource } from 'typeorm';

/**
 * Dependency Injection Container Configuration
 * Registers all dependencies and their implementations
 *
 * This is where you choose which implementations to use:
 * - InMemoryUserRepository for development/testing
 * - TypeORMUserRepository for production with database
 */
export const configureDependencies = (): void => {
  // Register repositories as singletons
  // For development: Use in-memory repository (singleton to maintain state)
  container.registerSingleton<IUserRepository>('IUserRepository', InMemoryUserRepository);

  // Register services
  container.register<ITokenService>('ITokenService', {
    useClass: JWTTokenService,
  });

  // For production with database: Uncomment below and comment above
  // Requires DataSource to be initialized first
  /*
  container.register<IUserRepository>('IUserRepository', {
    useFactory: (c) => {
      const dataSource = c.resolve<DataSource>('DataSource');
      return new TypeORMUserRepository(dataSource);
    },
  });
  */
};

// Export container for use in middlewares and controllers
export { container };
