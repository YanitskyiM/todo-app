import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './entities/todo.entity';
import { TodoChange, ChangeType } from './entities/todo-change.entity';
import { TodoAttachment } from './entities/todo-attachment.entity';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

// Promisify filesystem operations
const unlinkAsync = promisify(fs.unlink);
const mkdirAsync = promisify(fs.mkdir);

export interface CreateTodoDto {
  title: string;
}

export interface UpdateTodoDto {
  title?: string;
  completed?: boolean;
}

// Define a type for uploaded files to avoid TypeScript errors
export interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
  destination?: string;
  filename?: string;
  path?: string;
}

@Injectable()
export class TodosService {
  private readonly uploadsDir = path.join(process.cwd(), 'uploads');

  constructor(
    @InjectRepository(Todo)
    private todosRepository: Repository<Todo>,
    @InjectRepository(TodoChange)
    private todoChangesRepository: Repository<TodoChange>,
    @InjectRepository(TodoAttachment)
    private todoAttachmentsRepository: Repository<TodoAttachment>,
  ) {
    // Ensure uploads directory exists
    this.ensureUploadsDir();
  }

  private async ensureUploadsDir() {
    try {
      await mkdirAsync(this.uploadsDir, { recursive: true });
    } catch (error) {
      if (error.code !== 'EEXIST') {
        throw error;
      }
    }
  }

  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
    // Create the todo
    const todo = this.todosRepository.create(createTodoDto);
    const savedTodo = await this.todosRepository.save(todo);

    // Record the creation in the changelog
    await this.todoChangesRepository.save({
      todoId: savedTodo.id,
      changeType: ChangeType.CREATED,
      newValue: savedTodo.title,
    });

    return savedTodo;
  }

  async findAll(): Promise<Todo[]> {
    return await this.todosRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Todo> {
    const todo = await this.todosRepository.findOne({
      where: { id },
      relations: ['attachments'],
    });
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    return todo;
  }

  async update(id: string, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    const todo = await this.findOne(id);

    // Record changes to the title
    if (
      updateTodoDto.title !== undefined &&
      updateTodoDto.title !== todo.title
    ) {
      await this.todoChangesRepository.save({
        todoId: todo.id,
        changeType: ChangeType.TITLE_UPDATED,
        previousValue: todo.title,
        newValue: updateTodoDto.title,
      });
    }

    // Record changes to the completion status
    if (
      updateTodoDto.completed !== undefined &&
      updateTodoDto.completed !== todo.completed
    ) {
      await this.todoChangesRepository.save({
        todoId: todo.id,
        changeType: ChangeType.STATUS_UPDATED,
        previousValue: todo.completed ? 'completed' : 'not completed',
        newValue: updateTodoDto.completed ? 'completed' : 'not completed',
      });
    }

    // Update the todo
    Object.assign(todo, updateTodoDto);
    return await this.todosRepository.save(todo);
  }

  async remove(id: string): Promise<void> {
    const todo = await this.findOne(id);

    // Record the deletion in the changelog
    await this.todoChangesRepository.save({
      todoId: todo.id,
      changeType: ChangeType.DELETED,
      previousValue: todo.title,
    });

    await this.todosRepository.remove(todo);
  }

  async getTodoChanges(todoId: string): Promise<TodoChange[]> {
    // Verify todo exists
    await this.findOne(todoId);

    // Get all changes for this todo
    return await this.todoChangesRepository.find({
      where: { todoId },
      order: { createdAt: 'DESC' },
    });
  }

  async addAttachment(
    todoId: string,
    file: UploadedFile,
  ): Promise<TodoAttachment> {
    // Verify todo exists
    const todo = await this.findOne(todoId);

    // Validate file data
    if (!file) {
      throw new Error('Invalid file data: File is missing');
    }

    // When using disk storage, the file is already saved to disk
    // and file.path contains the path to the saved file
    let relativePath: string;
    let fullPath: string;

    if (file.path) {
      // File was saved by Multer's diskStorage
      fullPath = file.path;
      // Extract relative path from the full path
      relativePath = path.relative(this.uploadsDir, fullPath);
    } else if (file.buffer) {
      // If using memory storage and we have a buffer, save it manually
      // Generate a unique filename to prevent collisions
      const filename = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
      relativePath = `${todoId}/${filename}`;
      fullPath = path.join(this.uploadsDir, relativePath);

      // Ensure the todo directory exists
      const todoDir = path.join(this.uploadsDir, todoId);
      await mkdirAsync(todoDir, { recursive: true });

      // Save the file
      await fs.promises.writeFile(fullPath, file.buffer);
    } else {
      throw new Error('Invalid file data: Neither file path nor buffer is available');
    }

    // Create attachment record
    const attachment = this.todoAttachmentsRepository.create({
      todoId,
      filename: path.basename(fullPath),
      originalFilename: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      path: relativePath,
    });

    const savedAttachment = await this.todoAttachmentsRepository.save(attachment);

    // Record the attachment addition in the changelog
    await this.todoChangesRepository.save({
      todoId,
      changeType: ChangeType.ATTACHMENT_ADDED,
      newValue: file.originalname,
    });

    return savedAttachment;
  }

  async getAttachments(todoId: string): Promise<TodoAttachment[]> {
    // Verify todo exists
    await this.findOne(todoId);

    return await this.todoAttachmentsRepository.find({
      where: { todoId },
      order: { createdAt: 'DESC' },
    });
  }

  async getAttachment(id: string): Promise<TodoAttachment> {
    const attachment = await this.todoAttachmentsRepository.findOne({
      where: { id },
    });
    if (!attachment) {
      throw new NotFoundException(`Attachment with ID ${id} not found`);
    }
    return attachment;
  }

  async removeAttachment(id: string): Promise<void> {
    const attachment = await this.getAttachment(id);

    // Delete the file
    const fullPath = path.join(this.uploadsDir, attachment.path);
    try {
      await unlinkAsync(fullPath);
    } catch (error) {
      // Log but don't throw if file doesn't exist (may have been manually deleted)
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }

    // Record the attachment deletion in the changelog
    await this.todoChangesRepository.save({
      todoId: attachment.todoId,
      changeType: ChangeType.ATTACHMENT_DELETED,
      previousValue: attachment.originalFilename,
    });

    // Remove the attachment record
    await this.todoAttachmentsRepository.remove(attachment);
  }
}
