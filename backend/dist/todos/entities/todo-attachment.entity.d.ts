import { Todo } from './todo.entity';
export declare class TodoAttachment {
    id: string;
    todoId: string;
    todo: Todo;
    filename: string;
    originalFilename: string;
    mimeType: string;
    size: number;
    path: string;
    createdAt: Date;
}
