import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Res,
  StreamableFile,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TodosService } from './todos.service';
import type { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Controller('attachments')
export class AttachmentsController {
  private readonly logger = new Logger(AttachmentsController.name);
  private readonly uploadsDir = path.join(process.cwd(), 'uploads');

  constructor(private readonly todosService: TodosService) {}

  @Get('todo/:todoId')
  async getAttachmentsForTodo(@Param('todoId') todoId: string) {
    this.logger.log(`Getting attachments for todo with ID: ${todoId}`);
    try {
      const result = await this.todosService.getAttachments(todoId);
      this.logger.log(`Found ${result.length} attachments`);
      return result;
    } catch (error) {
      this.logger.error(
        `Error getting attachments: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Post('todo/:todoId')
  @UseInterceptors(FileInterceptor('file'))
  async addAttachment(
    @Param('todoId') todoId: string,
    @UploadedFile() file: any,
  ) {
    this.logger.log(`Adding attachment to todo with ID: ${todoId}`);
    return await this.todosService.addAttachment(todoId, file);
  }

  @Get(':id')
  async getAttachment(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    this.logger.log(`Getting specific attachment with ID: ${id}`);
    try {
      const attachment = await this.todosService.getAttachment(id);
      const filePath = path.join(this.uploadsDir, attachment.path);

      if (!fs.existsSync(filePath)) {
        throw new Error('File not found');
      }

      res.set({
        'Content-Type': attachment.mimeType,
        'Content-Disposition': `inline; filename="${attachment.originalFilename}"`,
      });

      const file = fs.createReadStream(filePath);
      return new StreamableFile(file);
    } catch (error) {
      this.logger.error(
        `Error getting attachment: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Delete(':id')
  async removeAttachment(@Param('id') id: string) {
    this.logger.log(`Removing attachment with ID: ${id}`);
    await this.todosService.removeAttachment(id);
    return { message: 'Attachment deleted successfully' };
  }
}
