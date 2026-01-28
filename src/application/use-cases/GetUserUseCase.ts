import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '@domain/repositories/IUserRepository';
import { EntityNotFoundException } from '@domain/exceptions/DomainException';
import { UserResponseDTO } from '../dtos/UserDTO';

/**
 * GetUser Use Case
 * Retrieves a user by their ID
 *
 * Demonstrates query pattern in Clean Architecture
 */
@injectable()
export class GetUserUseCase {
  constructor(@inject('IUserRepository') private readonly userRepository: IUserRepository) {}

  async execute(userId: string): Promise<UserResponseDTO> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new EntityNotFoundException('User', userId);
    }

    return {
      id: user.getId(),
      email: user.getEmail().getValue(),
      name: user.getName(),
      createdAt: user.getCreatedAt(),
      updatedAt: user.getUpdatedAt(),
    };
  }
}
