import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { TodosController } from './todos.controller';
import { AttachmentsController } from './attachments.controller';
import { TodosService } from './todos.service';
import { Todo } from './entities/todo.entity';
import { TodoChange } from './entities/todo-change.entity';
import { TodoAttachment } from './entities/todo-attachment.entity';
import { join } from 'path';
import * as fs from 'fs';

// Ensure uploads directory exists
const uploadsDir = join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

@Module({
  imports: [
    TypeOrmModule.forFeature([Todo, TodoChange, TodoAttachment]),
    MulterModule.register({
      storage: diskStorage({
        destination: uploadsDir,
        filename: (req, file, cb) => {
          // Generate a unique filename to prevent collisions
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = file.originalname.split('.').pop();
          cb(null, `${uniqueSuffix}.${ext}`);
        },
      }),
    }),
  ],
  controllers: [TodosController, AttachmentsController],
  providers: [TodosService],
})
export class TodosModule {}
