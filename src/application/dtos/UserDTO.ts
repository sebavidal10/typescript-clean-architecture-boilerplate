/**
 * Data Transfer Object for User responses
 * Used to transfer user data between layers without exposing domain entities
 */
export interface UserResponseDTO {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Data Transfer Object for creating a new user
 */
export interface CreateUserDTO {
  email: string;
  name: string;
}

/**
 * Data Transfer Object for updating a user
 */
export interface UpdateUserDTO {
  email?: string;
  name?: string;
}
