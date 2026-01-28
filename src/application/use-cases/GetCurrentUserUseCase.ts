import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '@domain/repositories/IUserRepository';
import { EntityNotFoundException } from '@domain/exceptions/DomainException';
import { UserResponseDTO } from '../dtos/UserDTO';

/**
 * Get Current User Use Case
 * Returns the authenticated user's profile
 */
@injectable()
export class GetCurrentUserUseCase {
  constructor(@inject('IUserRepository') private userRepository: IUserRepository) {}

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
