import { Repository } from 'typeorm';
import { Todo } from './entities/todo.entity';
import { TodoChange } from './entities/todo-change.entity';
import { TodoAttachment } from './entities/todo-attachment.entity';
export interface CreateTodoDto {
    title: string;
}
export interface UpdateTodoDto {
    title?: string;
    completed?: boolean;
    columnId?: string;
    order?: number;
}
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
export declare class TodosService {
    private todosRepository;
    private todoChangesRepository;
    private todoAttachmentsRepository;
    private readonly uploadsDir;
    constructor(todosRepository: Repository<Todo>, todoChangesRepository: Repository<TodoChange>, todoAttachmentsRepository: Repository<TodoAttachment>);
    private ensureUploadsDir;
    create(createTodoDto: CreateTodoDto): Promise<Todo>;
    findAll(): Promise<Todo[]>;
    findOne(id: string): Promise<Todo>;
    update(id: string, updateTodoDto: UpdateTodoDto): Promise<Todo>;
    remove(id: string): Promise<void>;
    getTodoChanges(todoId: string): Promise<TodoChange[]>;
    addAttachment(todoId: string, file: UploadedFile): Promise<TodoAttachment>;
    getAttachments(todoId: string): Promise<TodoAttachment[]>;
    getAttachment(id: string): Promise<TodoAttachment>;
    removeAttachment(id: string): Promise<void>;
    reorderTodos(todoIds: string[]): Promise<Todo[]>;
}
