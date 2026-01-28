import 'reflect-metadata';
import dotenv from 'dotenv';
import { createApp } from '@infrastructure/http/app';
import { configureDependencies } from '@infrastructure/di/container';
import { Logger } from '@shared/Logger';

// Load environment variables
dotenv.config();

// Configure dependency injection
configureDependencies();

// Create Express application
const app = createApp();

// Server configuration
const PORT = parseInt(process.env['PORT'] || '3000', 10);
const HOST = process.env['HOST'] || 'localhost';

// Start server
const server = app.listen(PORT, HOST, () => {
  Logger.info(`🚀 Server is running on http://${HOST}:${PORT}`);
  Logger.info(`📋 Environment: ${process.env['NODE_ENV'] || 'development'}`);
  Logger.info(`✓ Health check available at http://${HOST}:${PORT}/health`);
  Logger.info(`📚 API Documentation at http://${HOST}:${PORT}/api-docs`);
});

// Graceful shutdown
const shutdown = (): void => {
  Logger.info('Shutting down gracefully...');
  server.close(() => {
    Logger.info('Server closed');
    process.exit(0);
  });

  // Force close after 10 seconds
  setTimeout(() => {
    Logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

export default app;
