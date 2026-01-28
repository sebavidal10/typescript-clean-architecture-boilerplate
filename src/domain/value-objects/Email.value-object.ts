import { ValidationException } from '../exceptions/DomainException';

/**
 * Email Value Object
 * Encapsulates email validation logic and ensures immutability
 */
export class Email {
  private readonly value: string;

  constructor(email: string) {
    this.validate(email);
    this.value = email.toLowerCase().trim();
  }

  private validate(email: string): void {
    if (!email || email.trim().length === 0) {
      throw new ValidationException('Email cannot be empty');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ValidationException('Invalid email format');
    }

    if (email.length > 255) {
      throw new ValidationException('Email cannot exceed 255 characters');
    }
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
