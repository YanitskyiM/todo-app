import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
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
import type { CreateTodoDto, UpdateTodoDto } from './todos.service';
import type { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Controller('todos')
export class TodosController {
  private readonly logger = new Logger(TodosController.name);
  private readonly uploadsDir = path.join(process.cwd(), 'uploads');

  constructor(private readonly todosService: TodosService) {}

  @Post()
  async create(@Body() createTodoDto: CreateTodoDto) {
    return await this.todosService.create(createTodoDto);
  }

  @Post('reorder')
  async reorderTodos(@Body() reorderDto: { todoIds: string[] }) {
    return await this.todosService.reorderTodos(reorderDto.todoIds);
  }

  @Get()
  async findAll() {
    return await this.todosService.findAll();
  }

  // File Attachment Endpoints with specific paths first
  @Get('attachments/:id')
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

  @Delete('attachments/:id')
  async removeAttachment(@Param('id') id: string) {
    this.logger.log(`Removing attachment with ID: ${id}`);
    await this.todosService.removeAttachment(id);
    return { message: 'Attachment deleted successfully' };
  }

  // Todo-specific endpoints
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.todosService.findOne(id);
  }

  // Test endpoint to diagnose routing issues
  @Get(':id/test')
  async testEndpoint(@Param('id') id: string) {
    this.logger.log(`Test endpoint called with ID: ${id}`);
    return { message: 'Test endpoint working', id };
  }

  @Get(':id/changes')
  async getTodoChanges(@Param('id') id: string) {
    return await this.todosService.getTodoChanges(id);
  }

  @Get(':id/attachments')
  async getAttachments(@Param('id') id: string) {
    this.logger.log(`Getting attachments for todo with ID: ${id}`);
    try {
      const result = await this.todosService.getAttachments(id);
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

  @Post(':id/attachments')
  @UseInterceptors(FileInterceptor('file'))
  async addAttachment(
    @Param('id') id: string,
    @UploadedFile() file: any, // Change Express.Multer.File to any temporarily
  ) {
    this.logger.log(`Adding attachment to todo with ID: ${id}`);
    return await this.todosService.addAttachment(id, file);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
    return await this.todosService.update(id, updateTodoDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.todosService.remove(id);
  }
}
