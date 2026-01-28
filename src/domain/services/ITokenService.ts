/**
 * Token Service Interface
 * Defines contract for JWT token generation and validation
 */
export interface ITokenService {
  /**
   * Generate a JWT token for a user
   * @param userId - Unique user identifier
   * @returns JWT token string
   */
  generate(userId: string): string;

  /**
   * Verify and decode a JWT token
   * @param token - JWT token to verify
   * @returns Decoded payload with userId
   * @throws Error if token is invalid or expired
   */
  verify(token: string): { userId: string };
}
