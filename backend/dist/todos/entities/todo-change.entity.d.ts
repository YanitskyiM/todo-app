import { Todo } from './todo.entity';
export declare enum ChangeType {
    CREATED = "created",
    TITLE_UPDATED = "title_updated",
    STATUS_UPDATED = "status_updated",
    DELETED = "deleted",
    ATTACHMENT_ADDED = "attachment_added",
    ATTACHMENT_DELETED = "attachment_deleted"
}
export declare class TodoChange {
    id: string;
    todoId: string;
    todo: Todo;
    changeType: ChangeType;
    previousValue: string;
    newValue: string;
    createdAt: Date;
}
