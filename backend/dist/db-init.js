"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const typeorm_1 = require("typeorm");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const logger = new common_1.Logger('DatabaseInit');
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    logger.log('Starting database initialization...');
    try {
        const connection = (0, typeorm_1.getConnection)();
        const queryRunner = connection.createQueryRunner();
        const tableExists = await queryRunner.hasTable('todo_attachments');
        if (!tableExists) {
            logger.log('Creating todo_attachments table...');
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
        }
        else {
            logger.log('todo_attachments table already exists');
        }
        await queryRunner.release();
        logger.log('Database initialization completed successfully');
    }
    catch (error) {
        logger.error(`Database initialization failed: ${error.message}`, error.stack);
    }
    finally {
        await app.close();
    }
}
bootstrap();
//# sourceMappingURL=db-init.js.map