import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Todo as TodoType } from "../types/todo";
import { todoApi } from "../services/todoApi";
import { TodoForm } from "./TodoForm";
import { TodoList } from "./TodoList";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Loader2, RefreshCw, List, LayoutGrid, Plus, X, Pencil, Trash2, ArrowRight, Settings, Eye } from "lucide-react";
import { Input } from "./ui/input";
import { useSettings } from "../contexts/SettingsContext";

export const TodoApp: React.FC = () => {
  const { setIsSettingsOpen } = useSettings();
  const [editingTodo, setEditingTodo] = useState<TodoType | null>(null);
  const [showDemo, setShowDemo] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "board">("list");
  const [columns, setColumns] = useState<{id: string, name: string}[]>([
    { id: "todo", name: "To Do" },
    { id: "done", name: "Done" }
  ]);
  const [newColumnName, setNewColumnName] = useState("");
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const queryClient = useQueryClient();

  // Store columns in localStorage
  useEffect(() => {
    const storedColumns = localStorage.getItem("todoColumns");
    if (storedColumns) {
      setColumns(JSON.parse(storedColumns));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("todoColumns", JSON.stringify(columns));
  }, [columns]);

  // Function to add a new column
  const handleAddColumn = () => {
    if (newColumnName.trim()) {
      const newColumnId = `column-${Date.now()}`;
      setColumns([...columns, { id: newColumnId, name: newColumnName.trim() }]);
      setNewColumnName("");
      setIsAddingColumn(false);
    }
  };

  // Function to remove a column
  const handleRemoveColumn = (columnId: string) => {
    setColumns(columns.filter(column => column.id !== columnId));
  };

  // Function to handle moving a todo to a specific column
  const handleMoveTodoToColumn = (todoId: string, columnId: string) => {
    // Find the todo
    const todo = todos.find(t => t.id === todoId);
    if (!todo) return;

    // For built-in columns, use the existing toggle functionality
    if (columnId === "done") {
      toggleTodoMutation.mutate({ id: todoId, completed: true });
    } else if (columnId === "todo") {
      toggleTodoMutation.mutate({ id: todoId, completed: false });
    } else {
      // For custom columns, update both completion status and add custom column tracking
      updateTodoMutation.mutate({
        id: todoId,
        updates: {
          completed: false,
          columnId: columnId  // Store the column ID as custom metadata
        }
      });
    }
  };

  // Fetch todos
  const {
    data: todos = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: todoApi.getTodos,
  });

  // Create todo mutation
  const createTodoMutation = useMutation({
    mutationFn: async ({ title, file }: { title: string; file?: File }) => {
      // First create the todo
      const newTodo = await todoApi.createTodo({ title });

      // If a file was attached, upload it and associate with the new todo
      if (file) {
        await todoApi.uploadAttachment(newTodo.id, file);
      }

      return newTodo;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      queryClient.invalidateQueries({ queryKey: ["todoChanges", data.id] });
    },
  });

  // Update todo mutation
  const updateTodoMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) =>
      todoApi.updateTodo(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      queryClient.invalidateQueries({ queryKey: ["todoChanges", data.id] });
    },
  });

  // Delete todo mutation
  const deleteTodoMutation = useMutation({
    mutationFn: (id: string) => todoApi.deleteTodo(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      queryClient.invalidateQueries({ queryKey: ["todoChanges", id] });
    },
  });

  // Toggle todo completion
  const toggleTodoMutation = useMutation({
    mutationFn: ({ id, completed }: { id: string; completed: boolean }) =>
      todoApi.toggleTodo(id, completed),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      queryClient.invalidateQueries({ queryKey: ["todoChanges", data.id] });
    },
  });

  // Reorder todos mutation
  const reorderTodosMutation = useMutation({
    mutationFn: (todoIds: string[]) => todoApi.reorderTodos(todoIds),
    onMutate: async (todoIds: string[]) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["todos"] });

      // Snapshot the previous value
      const previousTodos = queryClient.getQueryData<TodoType[]>(["todos"]);

      // Optimistically update to the new value
      if (previousTodos) {
        const reorderedTodos = todoIds.map(id => 
          previousTodos.find(todo => todo.id === id)
        ).filter(Boolean) as TodoType[];
        
        queryClient.setQueryData<TodoType[]>(["todos"], reorderedTodos);
      }

      // Return a context object with the snapshotted value
      return { previousTodos };
    },
    onError: (err, todoIds, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousTodos) {
        queryClient.setQueryData(["todos"], context.previousTodos);
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we have the latest data
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const handleSubmit = (title: string, file?: File) => {
    if (editingTodo) {
      updateTodoMutation.mutate({ id: editingTodo.id, updates: { title } });
      setEditingTodo(null);
    } else {
      createTodoMutation.mutate({ title, file });
    }
  };

  const handleToggle = (id: string, completed: boolean) => {
    toggleTodoMutation.mutate({ id, completed });
  };

  const handleDelete = (id: string) => {
    deleteTodoMutation.mutate(id);
  };

  const handleEdit = (todo: TodoType) => {
    setEditingTodo(todo);
  };

  const handleCancelEdit = () => {
    setEditingTodo(null);
  };

  const handleReorder = (todoIds: string[]) => {
    reorderTodosMutation.mutate(todoIds);
  };

  // Show demo if requested
  if (showDemo) {
    const { AnimatedContainerDemo } = require('./AnimatedContainerDemo');
    return (
      <div className="min-h-screen">
        <div className="fixed top-4 left-4 z-50">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowDemo(false)}
            className="flex items-center gap-2"
          >
            <ArrowRight className="h-4 w-4" />
            Back to Todo App
          </Button>
        </div>
        <AnimatedContainerDemo />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="max-w-2xl mx-auto mt-8">
        <CardContent className="p-6">
          <div className="text-center text-destructive">
            <p>Error loading todos: {(error as Error).message}</p>
            <Button onClick={() => refetch()} className="mt-4">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="max-w-2xl mx-auto mt-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-center flex-1">Todo App</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSettingsOpen(true)}
              className="h-8 w-8 p-0"
              title="Settings"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
      <CardContent className="space-y-6">
        <TodoForm
          onSubmit={handleSubmit}
          todo={editingTodo}
          onCancel={handleCancelEdit}
        />

        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              onClick={() => setViewMode("list")}
            >
              <List className="h-5 w-5" />
            </Button>
            <Button
              variant={viewMode === "board" ? "default" : "outline"}
              onClick={() => setViewMode("board")}
            >
              <LayoutGrid className="h-5 w-5" />
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDemo(true)}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            View Demo
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <TodoList
            todos={todos as TodoType[]}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onReorder={handleReorder}
            viewMode={viewMode}
            columns={columns}
            onMoveTodoToColumn={handleMoveTodoToColumn}
            onAddColumn={(name) => {
              const newColumnId = `column-${Date.now()}`;
              setColumns([...columns, { id: newColumnId, name }]);
            }}
            onDeleteColumn={(columnId) => {
              // Filter out the column to be deleted
              setColumns(columns.filter(column => column.id !== columnId));
            }}
          />
        )}
      </CardContent>
      </Card>
    </>
  );
};
