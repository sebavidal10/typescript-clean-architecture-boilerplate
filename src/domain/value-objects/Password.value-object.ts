import bcrypt from 'bcrypt';
import { ValidationException } from '../exceptions/DomainException';

/**
 * Password Value Object
 * Encapsulates password validation and hashing logic
 */
export class Password {
  private readonly hashedValue: string;
  private static readonly SALT_ROUNDS = 10;
  private static readonly MIN_LENGTH = 8;
  private static readonly PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  private constructor(hashedValue: string) {
    this.hashedValue = hashedValue;
  }

  /**
   * Create a Password from plaintext
   * Validates format and hashes the password
   */
  static async create(plainPassword: string): Promise<Password> {
    this.validate(plainPassword);
    const hashed = await bcrypt.hash(plainPassword, this.SALT_ROUNDS);
    return new Password(hashed);
  }

  /**
   * Create a Password from an already hashed value
   * Used when loading from database
   */
  static fromHash(hashedValue: string): Password {
    return new Password(hashedValue);
  }

  /**
   * Compare a plaintext password with this hashed password
   */
  async compare(plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, this.hashedValue);
  }

  /**
   * Get the hashed value for persistence
   */
  getHashedValue(): string {
    return this.hashedValue;
  }

  private static validate(plainPassword: string): void {
    if (!plainPassword || plainPassword.trim().length === 0) {
      throw new ValidationException('Password cannot be empty');
    }

    if (plainPassword.length < this.MIN_LENGTH) {
      throw new ValidationException(`Password must be at least ${this.MIN_LENGTH} characters long`);
    }

    if (!this.PASSWORD_REGEX.test(plainPassword)) {
      throw new ValidationException(
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      );
    }
  }
}
