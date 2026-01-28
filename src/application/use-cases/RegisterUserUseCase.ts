import { inject, injectable } from 'tsyringe';
import { User } from '@domain/entities/User.entity';
import { Email } from '@domain/value-objects/Email.value-object';
import { Password } from '@domain/value-objects/Password.value-object';
import { IUserRepository } from '@domain/repositories/IUserRepository';
import { ITokenService } from '@domain/services/ITokenService';
import { DuplicateEntityException } from '@domain/exceptions/DomainException';
import { RegisterUserDTO, AuthResponseDTO } from '../dtos/AuthDTO';
import { v4 as uuidv4 } from 'uuid';

/**
 * Register User Use Case
 * Handles user registration with password hashing and token generation
 */
@injectable()
export class RegisterUserUseCase {
  constructor(
    @inject('IUserRepository') private userRepository: IUserRepository,
    @inject('ITokenService') private tokenService: ITokenService
  ) {}

  async execute(dto: RegisterUserDTO): Promise<AuthResponseDTO> {
    // Create value objects
    const email = new Email(dto.email);
    const password = await Password.create(dto.password);

    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new DuplicateEntityException('User', 'email', dto.email);
    }

    // Create user entity
    const user = new User(uuidv4(), email, dto.name, undefined, undefined, password);

    // Persist user
    await this.userRepository.create(user);

    // Generate token
    const token = this.tokenService.generate(user.getId());

    // Return response without password
    return {
      user: {
        id: user.getId(),
        email: user.getEmail().getValue(),
        name: user.getName(),
        createdAt: user.getCreatedAt(),
        updatedAt: user.getUpdatedAt(),
      },
      token,
    };
  }
}
