import { Todo, CreateTodoRequest, UpdateTodoRequest, TodoChange, TodoAttachment } from '@/types/todo';

const API_BASE_URL = 'http://localhost:3001';

export const todoApi = {
  // Get all todos
  async getTodos(): Promise<Todo[]> {
    const response = await fetch(`${API_BASE_URL}/todos`);
    if (!response.ok) {
      throw new Error('Failed to fetch todos');
    }
    return response.json();
  },

  // Create a new todo
  async createTodo(todo: CreateTodoRequest): Promise<Todo> {
    const response = await fetch(`${API_BASE_URL}/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todo),
    });
    if (!response.ok) {
      throw new Error('Failed to create todo');
    }
    return response.json();
  },

  // Update a todo
  async updateTodo(id: string, updates: UpdateTodoRequest): Promise<Todo> {
    const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    if (!response.ok) {
      throw new Error('Failed to update todo');
    }
    return response.json();
  },

  // Delete a todo
  async deleteTodo(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete todo');
    }
  },

  // Toggle todo completion status
  async toggleTodo(id: string, completed: boolean): Promise<Todo> {
    return this.updateTodo(id, { completed });
  },

  // Get changes for a todo
  async getTodoChanges(id: string): Promise<TodoChange[]> {
    const response = await fetch(`${API_BASE_URL}/todos/${id}/changes`);
    if (!response.ok) {
      throw new Error('Failed to fetch todo changes');
    }
    return response.json();
  },

  // Get a specific todo
  async getTodo(id: string): Promise<Todo> {
    const response = await fetch(`${API_BASE_URL}/todos/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch todo');
    }
    return response.json();
  },

  // File attachment methods

  // Get all attachments for a todo
  async getTodoAttachments(todoId: string): Promise<TodoAttachment[]> {
    const response = await fetch(`${API_BASE_URL}/attachments/todo/${todoId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch attachments');
    }

    return response.json();
  },

  // Upload a file attachment to a todo
  async uploadAttachment(todoId: string, file: File): Promise<TodoAttachment> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/attachments/todo/${todoId}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload attachment');
    }

    return response.json();
  },

  // Delete an attachment
  async deleteAttachment(attachmentId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/attachments/${attachmentId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete attachment');
    }
  },

  // Get the URL for an attachment
  getAttachmentUrl(attachmentId: string): string {
    return `${API_BASE_URL}/attachments/${attachmentId}`;
  },

  // Reorder todos
  async reorderTodos(todoIds: string[]): Promise<Todo[]> {
    const response = await fetch(`${API_BASE_URL}/todos/reorder`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ todoIds }),
    });
    if (!response.ok) {
      throw new Error('Failed to reorder todos');
    }
    return response.json();
  }
};
