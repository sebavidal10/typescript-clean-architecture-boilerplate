import 'reflect-metadata';
import { CreateUserUseCase } from '../CreateUserUseCase';
import { IUserRepository } from '@domain/repositories/IUserRepository';
import { User } from '@domain/entities/User.entity';
import { DuplicateEntityException } from '@domain/exceptions/DomainException';

/**
 * Mock implementation of IUserRepository for testing
 */
class MockUserRepository implements IUserRepository {
  private users: User[] = [];

  async create(user: User): Promise<User> {
    this.users.push(user);
    return Promise.resolve(user);
  }

  async findById(id: string): Promise<User | null> {
    return Promise.resolve(this.users.find((u) => u.getId() === id) || null);
  }

  async findByEmail(email: string): Promise<User | null> {
    return Promise.resolve(this.users.find((u) => u.getEmail().getValue() === email) || null);
  }

  async findAll(): Promise<User[]> {
    return Promise.resolve(this.users);
  }

  async update(user: User): Promise<User> {
    const index = this.users.findIndex((u) => u.getId() === user.getId());
    if (index !== -1) {
      this.users[index] = user;
    }
    return Promise.resolve(user);
  }

  async delete(id: string): Promise<void> {
    this.users = this.users.filter((u) => u.getId() !== id);
    return Promise.resolve();
  }

  // Helper method for testing
  clear(): void {
    this.users = [];
  }
}

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let mockRepository: MockUserRepository;

  beforeEach(() => {
    mockRepository = new MockUserRepository();
    useCase = new CreateUserUseCase(mockRepository);
  });

  afterEach(() => {
    mockRepository.clear();
  });

  describe('execute', () => {
    it('should create a new user successfully', async () => {
      // Arrange
      const createUserDTO = {
        email: 'test@example.com',
        name: 'Test User',
      };

      // Act
      const result = await useCase.execute(createUserDTO);

      // Assert
      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.email).toBe(createUserDTO.email);
      expect(result.name).toBe(createUserDTO.name);
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
    });

    it('should throw DuplicateEntityException when email already exists', async () => {
      // Arrange
      const createUserDTO = {
        email: 'duplicate@example.com',
        name: 'First User',
      };

      await useCase.execute(createUserDTO);

      const duplicateDTO = {
        email: 'duplicate@example.com',
        name: 'Second User',
      };

      // Act & Assert
      await expect(useCase.execute(duplicateDTO)).rejects.toThrow(DuplicateEntityException);
    });

    it('should validate email format', async () => {
      // Arrange
      const invalidEmailDTO = {
        email: 'invalid-email',
        name: 'Test User',
      };

      // Act & Assert
      await expect(useCase.execute(invalidEmailDTO)).rejects.toThrow();
    });

    it('should validate name is not empty', async () => {
      // Arrange
      const emptyNameDTO = {
        email: 'test@example.com',
        name: '',
      };

      // Act & Assert
      await expect(useCase.execute(emptyNameDTO)).rejects.toThrow();
    });

    it('should persist user in repository', async () => {
      // Arrange
      const createUserDTO = {
        email: 'persist@example.com',
        name: 'Persist User',
      };

      // Act
      await useCase.execute(createUserDTO);
      const users = await mockRepository.findAll();

      // Assert
      expect(users).toHaveLength(1);
      expect(users[0]?.getEmail().getValue()).toBe(createUserDTO.email);
    });
  });
});
