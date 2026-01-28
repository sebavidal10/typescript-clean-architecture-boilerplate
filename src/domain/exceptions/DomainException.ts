/**
 * Base exception class for domain-related errors
 * All domain exceptions should extend this class
 */
export class DomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Thrown when domain validation rules are violated
 */
export class ValidationException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}

/**
 * Thrown when an entity is not found
 */
export class EntityNotFoundException extends DomainException {
  constructor(entityName: string, identifier: string | number) {
    super(`${entityName} with identifier ${identifier} not found`);
  }
}

/**
 * Thrown when attempting to create a duplicate entity
 */
export class DuplicateEntityException extends DomainException {
  constructor(entityName: string, field: string, value: string) {
    super(`${entityName} with ${field} "${value}" already exists`);
  }
}
