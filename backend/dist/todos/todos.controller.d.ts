import { StreamableFile } from '@nestjs/common';
import { TodosService } from './todos.service';
import type { CreateTodoDto, UpdateTodoDto } from './todos.service';
import type { Response } from 'express';
export declare class TodosController {
    private readonly todosService;
    private readonly logger;
    private readonly uploadsDir;
    constructor(todosService: TodosService);
    create(createTodoDto: CreateTodoDto): Promise<import("./entities/todo.entity").Todo>;
    reorderTodos(reorderDto: {
        todoIds: string[];
    }): Promise<import("./entities/todo.entity").Todo[]>;
    findAll(): Promise<import("./entities/todo.entity").Todo[]>;
    getAttachment(id: string, res: Response): Promise<StreamableFile>;
    removeAttachment(id: string): Promise<{
        message: string;
    }>;
    findOne(id: string): Promise<import("./entities/todo.entity").Todo>;
    testEndpoint(id: string): Promise<{
        message: string;
        id: string;
    }>;
    getTodoChanges(id: string): Promise<import("./entities/todo-change.entity").TodoChange[]>;
    getAttachments(id: string): Promise<import("./entities/todo-attachment.entity").TodoAttachment[]>;
    addAttachment(id: string, file: any): Promise<import("./entities/todo-attachment.entity").TodoAttachment>;
    update(id: string, updateTodoDto: UpdateTodoDto): Promise<import("./entities/todo.entity").Todo>;
    remove(id: string): Promise<void>;
}
