import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '@domain/repositories/IUserRepository';
import { ITokenService } from '@domain/services/ITokenService';
import { EntityNotFoundException, ValidationException } from '@domain/exceptions/DomainException';
import { LoginDTO, AuthResponseDTO } from '../dtos/AuthDTO';

/**
 * Login Use Case
 * Handles user authentication and token generation
 */
@injectable()
export class LoginUseCase {
  constructor(
    @inject('IUserRepository') private userRepository: IUserRepository,
    @inject('ITokenService') private tokenService: ITokenService
  ) {}

  async execute(dto: LoginDTO): Promise<AuthResponseDTO> {
    // Find user by email
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new EntityNotFoundException('User', `email ${dto.email}`);
    }

    // Get user password
    const password = user.getPassword();
    if (!password) {
      throw new ValidationException('User does not have a password set');
    }

    // Verify password
    const isValid = await password.compare(dto.password);
    if (!isValid) {
      throw new ValidationException('Invalid credentials');
    }

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
