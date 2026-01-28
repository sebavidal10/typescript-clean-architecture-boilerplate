/**
 * Result Pattern Implementation
 * Type-safe alternative to throwing exceptions
 * Useful for operations that can fail in expected ways
 */
export class Result<T, E = Error> {
  private constructor(
    private readonly value?: T,
    private readonly error?: E,
    private readonly isSuccess: boolean = true
  ) {}

  static ok<T, E = Error>(value: T): Result<T, E> {
    return new Result<T, E>(value, undefined, true);
  }

  static fail<T, E = Error>(error: E): Result<T, E> {
    return new Result<T, E>(undefined, error, false);
  }

  isOk(): boolean {
    return this.isSuccess;
  }

  isError(): boolean {
    return !this.isSuccess;
  }

  getValue(): T {
    if (!this.isSuccess) {
      throw new Error('Cannot get value from a failed result');
    }
    return this.value as T;
  }

  getError(): E {
    if (this.isSuccess) {
      throw new Error('Cannot get error from a successful result');
    }
    return this.error as E;
  }

  map<U>(fn: (value: T) => U): Result<U, E> {
    if (this.isSuccess) {
      return Result.ok(fn(this.value as T));
    }
    return Result.fail(this.error as E);
  }

  mapError<F>(fn: (error: E) => F): Result<T, F> {
    if (!this.isSuccess) {
      return Result.fail(fn(this.error as E));
    }
    return Result.ok(this.value as T);
  }
}
