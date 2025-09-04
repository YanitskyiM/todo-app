import { TodoChange } from './todo-change.entity';
import { TodoAttachment } from './todo-attachment.entity';
export declare class Todo {
    id: string;
    title: string;
    completed: boolean;
    order: number;
    createdAt: Date;
    updatedAt: Date;
    changes: TodoChange[];
    attachments: TodoAttachment[];
}
