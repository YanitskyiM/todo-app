import React, { useState } from 'react';
import { Todo as TodoType } from '../types/todo';
import { Checkbox } from './ui/checkbox';
import { Button } from './ui/button';
import { Trash2, Edit, ChevronDown, PaperclipIcon } from 'lucide-react';
import { TodoChangeLog } from './TodoChangeLog';
import { TodoAttachments } from './TodoAttachments';

interface TodoProps {
  todo: TodoType;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
  onEdit: (todo: TodoType) => void;
}

export const Todo: React.FC<TodoProps> = ({ todo, onToggle, onDelete, onEdit }) => {
  const [showChangelog, setShowChangelog] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);

  return (
    <div className="flex flex-col bg-card border rounded-lg shadow-sm">
      <div className="flex items-center space-x-3 p-4">
        <Checkbox
          checked={todo.completed}
          onCheckedChange={(checked: boolean | 'indeterminate') => onToggle(todo.id, checked === true)}
          className="flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium ${todo.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
            {todo.title}
          </p>
          <p className="text-xs text-muted-foreground">
            Created: {new Date(todo.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(todo)}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(todo.id)}
            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="border-t px-4 py-2">
        <div className="flex justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center justify-between p-0 h-6"
            onClick={() => setShowAttachments(!showAttachments)}
          >
            <span className="text-xs mr-1">Attachments</span>
            <PaperclipIcon className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center justify-between p-0 h-6"
            onClick={() => setShowChangelog(!showChangelog)}
          >
            <span className="text-xs">View change history</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${showChangelog ? 'rotate-180' : ''}`} />
          </Button>
        </div>

        {showAttachments && (
          <div className="pt-2 pb-3">
            <TodoAttachments todoId={todo.id} />
          </div>
        )}

        {showChangelog && (
          <div className="pt-2 pb-3">
            <TodoChangeLog todoId={todo.id} />
          </div>
        )}
      </div>
    </div>
  );
};
