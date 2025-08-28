import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getConnection } from 'typeorm';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('DatabaseInit');
  const app = await NestFactory.create(AppModule);

  logger.log('Starting database initialization...');

  try {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    // Check if the todo_attachments table exists
    const tableExists = await queryRunner.hasTable('todo_attachments');

    if (!tableExists) {
      logger.log('Creating todo_attachments table...');

      // Create the todo_attachments table manually
      await queryRunner.query(`
        CREATE TABLE "todo_attachments" (
          "id" varchar PRIMARY KEY,
          "todoId" varchar NOT NULL,
          "filename" varchar(255) NOT NULL,
          "originalFilename" varchar(255) NOT NULL,
          "mimeType" varchar(100) NOT NULL,
          "size" integer NOT NULL,
          "path" varchar(500) NOT NULL,
          "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
          CONSTRAINT "FK_todo_attachments_todo" FOREIGN KEY ("todoId") REFERENCES "todos" ("id") ON DELETE CASCADE
        )
      `);

      logger.log('todo_attachments table created successfully');
    } else {
      logger.log('todo_attachments table already exists');
    }

    await queryRunner.release();
    logger.log('Database initialization completed successfully');
  } catch (error) {
    logger.error(
      `Database initialization failed: ${error.message}`,
      error.stack,
    );
  } finally {
    await app.close();
  }
}

bootstrap();
