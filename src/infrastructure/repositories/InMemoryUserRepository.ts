import { IUserRepository } from '@domain/repositories/IUserRepository';
import { User } from '@domain/entities/User.entity';

/**
 * In-Memory implementation of IUserRepository
 * Perfect for development, testing, and demonstrations
 * Can be easily swapped with a real database implementation
 */
export class InMemoryUserRepository implements IUserRepository {
  private users: Map<string, User> = new Map();

  async create(user: User): Promise<User> {
    this.users.set(user.getId(), user);
    return Promise.resolve(user);
  }

  async findById(id: string): Promise<User | null> {
    return Promise.resolve(this.users.get(id) || null);
  }

  async findByEmail(email: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.getEmail().getValue() === email) {
        return Promise.resolve(user);
      }
    }
    return Promise.resolve(null);
  }

  async findAll(): Promise<User[]> {
    return Promise.resolve(Array.from(this.users.values()));
  }

  async update(user: User): Promise<User> {
    this.users.set(user.getId(), user);
    return Promise.resolve(user);
  }

  async delete(id: string): Promise<void> {
    this.users.delete(id);
    return Promise.resolve();
  }
}
