import { DataSource } from 'typeorm';
import { UserSchema } from './schemas/UserSchema';

/**
 * Database configuration using TypeORM
 * Reads configuration from environment variables
 */
export const createDataSource = (): DataSource => {
  return new DataSource({
    type: (process.env['DB_TYPE'] as 'postgres') || 'postgres',
    host: process.env['DB_HOST'] || 'localhost',
    port: parseInt(process.env['DB_PORT'] || '5432', 10),
    username: process.env['DB_USERNAME'] || 'postgres',
    password: process.env['DB_PASSWORD'] || 'password',
    database: process.env['DB_DATABASE'] || 'clean_architecture_db',
    entities: [UserSchema],
    synchronize: process.env['NODE_ENV'] !== 'production', // Only in development!
    logging: process.env['NODE_ENV'] === 'development',
  });
};

/**
 * Initialize database connection
 */
export const initializeDatabase = async (): Promise<DataSource> => {
  const dataSource = createDataSource();
  await dataSource.initialize();
  return dataSource;
};
