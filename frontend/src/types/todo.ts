export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  attachments?: TodoAttachment[];
  columnId?: string; // Add columnId property to support custom column assignment
}

export interface TodoAttachment {
  id: string;
  todoId: string;
  filename: string;
  originalFilename: string;
  mimeType: string;
  size: number;
  path: string;
  createdAt: string;
}

export interface CreateTodoRequest {
  title: string;
}

export interface UpdateTodoRequest {
  title?: string;
  completed?: boolean;
}

export enum ChangeType {
  CREATED = 'created',
  TITLE_UPDATED = 'title_updated',
  STATUS_UPDATED = 'status_updated',
  DELETED = 'deleted',
  ATTACHMENT_ADDED = 'attachment_added',
  ATTACHMENT_DELETED = 'attachment_deleted'
}

export interface TodoChange {
  id: string;
  todoId: string;
  changeType: ChangeType;
  previousValue: string | null;
  newValue: string | null;
  createdAt: string;
}
