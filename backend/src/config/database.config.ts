import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Todo } from '../todos/entities/todo.entity';
import { TodoChange } from '../todos/entities/todo-change.entity';
import { TodoAttachment } from '../todos/entities/todo-attachment.entity';

// Database configuration with support for both SQLite and PostgreSQL
export const databaseConfig: TypeOrmModuleOptions = {
  // Use SQLite by default, can be overridden with environment variables
  type: (process.env.DB_TYPE as any) || 'sqlite',
  
  // SQLite configuration
  database: process.env.DB_DATABASE || 'database.sqlite',
  
  // PostgreSQL configuration (when DB_TYPE=postgres)
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  
  // Common configuration
  entities: [Todo, TodoChange, TodoAttachment],
  synchronize: process.env.NODE_ENV !== 'production', // Auto-create tables (only for development)
  logging: process.env.NODE_ENV !== 'production', // Log SQL queries (only for development)
  
  // SQLite specific
  ...(process.env.DB_TYPE === 'postgres' ? {} : {
    // SQLite specific options
  }),
  
  // PostgreSQL specific
  ...(process.env.DB_TYPE === 'postgres' ? {
    // PostgreSQL specific options
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  } : {}),
};
