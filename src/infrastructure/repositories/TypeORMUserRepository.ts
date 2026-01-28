import { DataSource, Repository } from 'typeorm';
import { IUserRepository } from '@domain/repositories/IUserRepository';
import { User } from '@domain/entities/User.entity';
import { Email } from '@domain/value-objects/Email.value-object';
import { UserModel, UserSchema } from '../database/schemas/UserSchema';

/**
 * TypeORM implementation of IUserRepository
 * Handles mapping between domain entities and database models
 * Can be used in production with PostgreSQL, MySQL, etc.
 */
export class TypeORMUserRepository implements IUserRepository {
  private repository: Repository<UserModel>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(UserSchema);
  }

  async create(user: User): Promise<User> {
    const userModel = this.toModel(user);
    const saved = await this.repository.save(userModel);
    return this.toDomain(saved);
  }

  async findById(id: string): Promise<User | null> {
    const userModel = await this.repository.findOne({ where: { id } });
    return userModel ? this.toDomain(userModel) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const userModel = await this.repository.findOne({ where: { email } });
    return userModel ? this.toDomain(userModel) : null;
  }

  async findAll(): Promise<User[]> {
    const userModels = await this.repository.find();
    return userModels.map((model) => this.toDomain(model));
  }

  async update(user: User): Promise<User> {
    const userModel = this.toModel(user);
    const updated = await this.repository.save(userModel);
    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  /**
   * Maps domain entity to database model
   */
  private toModel(user: User): UserModel {
    return {
      id: user.getId(),
      email: user.getEmail().getValue(),
      name: user.getName(),
      createdAt: user.getCreatedAt(),
      updatedAt: user.getUpdatedAt(),
    };
  }

  /**
   * Maps database model to domain entity
   */
  private toDomain(model: UserModel): User {
    const email = new Email(model.email);
    return new User(model.id, email, model.name, model.createdAt, model.updatedAt);
  }
}
