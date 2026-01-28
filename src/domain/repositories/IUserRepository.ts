import { User } from '../entities/User.entity';

/**
 * Repository interface for User entity
 * Defines the contract for data persistence operations
 * Framework and database agnostic - part of the domain layer
 */
export interface IUserRepository {
  /**
   * Creates a new user
   * @param user - User entity to persist
   * @returns Promise resolving to the created user
   */
  create(user: User): Promise<User>;

  /**
   * Finds a user by their unique ID
   * @param id - User identifier
   * @returns Promise resolving to user if found, null otherwise
   */
  findById(id: string): Promise<User | null>;

  /**
   * Finds a user by their email address
   * @param email - User email
   * @returns Promise resolving to user if found, null otherwise
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Retrieves all users
   * @returns Promise resolving to array of all users
   */
  findAll(): Promise<User[]>;

  /**
   * Updates an existing user
   * @param user - User entity with updated data
   * @returns Promise resolving to the updated user
   */
  update(user: User): Promise<User>;

  /**
   * Deletes a user by ID
   * @param id - User identifier
   * @returns Promise resolving to void
   */
  delete(id: string): Promise<void>;
}
