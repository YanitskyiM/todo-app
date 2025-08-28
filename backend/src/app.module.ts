import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodosModule } from './todos/todos.module';
import { AttachmentsModule } from './todos/attachments.module';
import { databaseConfig } from './config/database.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    TodosModule,
    AttachmentsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
