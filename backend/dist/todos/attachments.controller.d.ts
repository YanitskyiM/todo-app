import { StreamableFile } from '@nestjs/common';
import { TodosService } from './todos.service';
import type { Response } from 'express';
export declare class AttachmentsController {
    private readonly todosService;
    private readonly logger;
    private readonly uploadsDir;
    constructor(todosService: TodosService);
    getAttachmentsForTodo(todoId: string): Promise<import("./entities/todo-attachment.entity").TodoAttachment[]>;
    addAttachment(todoId: string, file: any): Promise<import("./entities/todo-attachment.entity").TodoAttachment>;
    getAttachment(id: string, res: Response): Promise<StreamableFile>;
    removeAttachment(id: string): Promise<{
        message: string;
    }>;
}
