import { inject, injectable } from 'tsyringe';
import { User } from '@domain/entities/User.entity';
import { Email } from '@domain/value-objects/Email.value-object';
import { IUserRepository } from '@domain/repositories/IUserRepository';
import { DuplicateEntityException } from '@domain/exceptions/DomainException';
import { CreateUserDTO, UserResponseDTO } from '../dtos/UserDTO';
import { randomUUID } from 'crypto';

/**
 * CreateUser Use Case
 * Orchestrates the creation of a new user following business rules
 *
 * Single Responsibility: Handle user creation logic
 * Depends on abstractions (IUserRepository) not concretions
 */
@injectable()
export class CreateUserUseCase {
  constructor(@inject('IUserRepository') private readonly userRepository: IUserRepository) {}

  async execute(dto: CreateUserDTO): Promise<UserResponseDTO> {
    // Business rule: Email must be unique
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new DuplicateEntityException('User', 'email', dto.email);
    }

    // Create domain entity with validated data
    const email = new Email(dto.email);
    const user = new User(randomUUID(), email, dto.name);

    // Persist the entity
    const createdUser = await this.userRepository.create(user);

    // Return DTO instead of domain entity
    return this.toDTO(createdUser);
  }

  private toDTO(user: User): UserResponseDTO {
    return {
      id: user.getId(),
      email: user.getEmail().getValue(),
      name: user.getName(),
      createdAt: user.getCreatedAt(),
      updatedAt: user.getUpdatedAt(),
    };
  }
}
