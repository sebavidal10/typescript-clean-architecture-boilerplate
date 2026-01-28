import { Email } from '../value-objects/Email.value-object';
import { Password } from '../value-objects/Password.value-object';
import { ValidationException } from '../exceptions/DomainException';

/**
 * User Entity - Core domain model
 * Represents a user in the system with business rules and invariants
 */
export class User {
  private readonly id: string;
  private email: Email;
  private name: string;
  private password?: Password; // Optional for backward compatibility
  private readonly createdAt: Date;
  private updatedAt: Date;

  constructor(
    id: string,
    email: Email,
    name: string,
    createdAt?: Date,
    updatedAt?: Date,
    password?: Password
  ) {
    this.validateName(name);

    this.id = id;
    this.email = email;
    this.name = name;
    this.password = password;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getEmail(): Email {
    return this.email;
  }

  getName(): string {
    return this.name;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  getPassword(): Password | undefined {
    return this.password;
  }

  // Business methods
  updateEmail(newEmail: Email): void {
    this.email = newEmail;
    this.updatedAt = new Date();
  }

  updateName(newName: string): void {
    this.validateName(newName);
    this.name = newName;
    this.updatedAt = new Date();
  }

  updatePassword(newPassword: Password): void {
    this.password = newPassword;
    this.updatedAt = new Date();
  }

  // Private validation
  private validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new ValidationException('Name cannot be empty');
    }

    if (name.length < 2) {
      throw new ValidationException('Name must be at least 2 characters');
    }

    if (name.length > 100) {
      throw new ValidationException('Name cannot exceed 100 characters');
    }
  }

  // For testing and equality checks
  equals(other: User): boolean {
    return this.id === other.id;
  }
}
