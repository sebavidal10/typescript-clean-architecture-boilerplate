/**
 * Simple Logger utility
 * Can be easily replaced with Winston, Pino, or other logging libraries
 */
export class Logger {
  private static getTimestamp(): string {
    return new Date().toISOString();
  }

  static info(message: string, ...args: unknown[]): void {
    console.log(`[${this.getTimestamp()}] [INFO] ${message}`, ...args);
  }

  static error(message: string, ...args: unknown[]): void {
    console.error(`[${this.getTimestamp()}] [ERROR] ${message}`, ...args);
  }

  static warn(message: string, ...args: unknown[]): void {
    console.warn(`[${this.getTimestamp()}] [WARN] ${message}`, ...args);
  }

  static debug(message: string, ...args: unknown[]): void {
    if (process.env['NODE_ENV'] === 'development' || process.env['LOG_LEVEL'] === 'debug') {
      console.debug(`[${this.getTimestamp()}] [DEBUG] ${message}`, ...args);
    }
  }
}
